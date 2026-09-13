import uuid
import datetime
from sqlalchemy.orm import Session
from backend.models.domain import Supplier, Route, Warehouse, CustomerDemand, Disruption, AuditLog
from backend.events import increment_env_version, event_bus

class DisruptionEngine:
    def __init__(self, db: Session):
        self.db = db

    def inject_supplier_shutdown(self, supplier_id: str, description: str = "Supplier facility emergency shutdown") -> Disruption:
        supplier = self.db.query(Supplier).filter_by(id=supplier_id).first()
        if not supplier:
            raise ValueError(f"Supplier {supplier_id} not found")

        supplier.status = "DISRUPTED"
        supplier.available_capacity = 0.0

        disruption = Disruption(
            id=f"DIS-SUP-{uuid.uuid4().hex[:6]}",
            type="SUPPLIER_SHUTDOWN",
            entity_type="SUPPLIER",
            entity_id=supplier_id,
            severity=1.0,
            description=description,
            status="ACTIVE"
        )
        self.db.add(disruption)

        audit = AuditLog(
            action_name="DISRUPTION_INJECTED",
            payload={"type": "SUPPLIER_SHUTDOWN", "supplier_id": supplier_id, "capacity": 0.0}
        )
        self.db.add(audit)
        self.db.commit()
        self.db.refresh(disruption)

        increment_env_version(self.db, reason=f"Supplier {supplier_id} Shutdown")
        event_bus.publish_sync("DISRUPTION_INJECTED", disruption.to_dict())

        return disruption

    def inject_supplier_capacity_reduction(self, supplier_id: str, reduction_pct: float = 0.50, description: str = "Supplier raw material shortage") -> Disruption:
        supplier = self.db.query(Supplier).filter_by(id=supplier_id).first()
        if not supplier:
            raise ValueError(f"Supplier {supplier_id} not found")

        supplier.status = "CAPACITY_REDUCED"
        supplier.available_capacity = max(0.0, supplier.max_capacity * (1.0 - reduction_pct))

        disruption = Disruption(
            id=f"DIS-CAP-{uuid.uuid4().hex[:6]}",
            type="CAPACITY_REDUCTION",
            entity_type="SUPPLIER",
            entity_id=supplier_id,
            severity=reduction_pct,
            description=f"{description} ({int(reduction_pct*100)}% reduction)",
            status="ACTIVE"
        )
        self.db.add(disruption)

        audit = AuditLog(
            action_name="DISRUPTION_INJECTED",
            payload={"type": "CAPACITY_REDUCTION", "supplier_id": supplier_id, "available_capacity": supplier.available_capacity}
        )
        self.db.add(audit)
        self.db.commit()
        self.db.refresh(disruption)

        increment_env_version(self.db, reason=f"Supplier {supplier_id} Capacity Reduced by {int(reduction_pct*100)}%")
        event_bus.publish_sync("DISRUPTION_INJECTED", disruption.to_dict())

        return disruption

    def inject_route_closure(self, route_id: str, description: str = "Major highway blockage due to monsoon flooding") -> Disruption:
        route = self.db.query(Route).filter_by(id=route_id).first()
        if not route:
            raise ValueError(f"Route {route_id} not found")

        route.status = "CLOSED"

        disruption = Disruption(
            id=f"DIS-RTE-{uuid.uuid4().hex[:6]}",
            type="ROUTE_CLOSURE",
            entity_type="ROUTE",
            entity_id=route_id,
            severity=1.0,
            description=description,
            status="ACTIVE"
        )
        self.db.add(disruption)

        audit = AuditLog(
            action_name="DISRUPTION_INJECTED",
            payload={"type": "ROUTE_CLOSURE", "route_id": route_id}
        )
        self.db.add(audit)
        self.db.commit()
        self.db.refresh(disruption)

        increment_env_version(self.db, reason=f"Route {route_id} Closed")
        event_bus.publish_sync("DISRUPTION_INJECTED", disruption.to_dict())

        return disruption

    def inject_demand_spike(self, store_id: str, sku: str, multiplier: float = 2.0, description: str = "Regional retail festival demand spike") -> Disruption:
        demand = self.db.query(CustomerDemand).filter_by(store_id=store_id, sku=sku).first()
        if not demand:
            raise ValueError(f"Demand for store {store_id} and SKU {sku} not found")

        demand.target_quantity *= multiplier

        disruption = Disruption(
            id=f"DIS-DEM-{uuid.uuid4().hex[:6]}",
            type="DEMAND_SPIKE",
            entity_type="RETAILER",
            entity_id=store_id,
            severity=multiplier,
            description=f"{description} (Target demand increased to {demand.target_quantity})",
            status="ACTIVE"
        )
        self.db.add(disruption)

        audit = AuditLog(
            action_name="DISRUPTION_INJECTED",
            payload={"type": "DEMAND_SPIKE", "store_id": store_id, "sku": sku, "new_target": demand.target_quantity}
        )
        self.db.add(audit)
        self.db.commit()
        self.db.refresh(disruption)

        increment_env_version(self.db, reason=f"Demand Spike at Store {store_id} for SKU {sku}")
        event_bus.publish_sync("DISRUPTION_INJECTED", disruption.to_dict())

        return disruption

    def reset_all_disruptions(self):
        from backend.seed.seed_data import seed_database
        seed_database(self.db)
        increment_env_version(self.db, reason="Environment reset to baseline")
        event_bus.publish_sync("ENVIRONMENT_RESET", {"status": "SUCCESS"})
        return {"status": "SUCCESS", "message": "Environment reset to healthy baseline state"}

