from sqlalchemy.orm import Session
from backend.models.domain import (
    Supplier, Warehouse, RetailStore, Route, Inventory,
    Shipment, CustomerDemand, Disruption, PurchaseOrder
)
from typing import Dict, Any, List

class SimulationEngine:
    def __init__(self, db: Session):
        self.db = db

    def get_network_state(self) -> Dict[str, Any]:
        suppliers = [s.to_dict() for s in self.db.query(Supplier).all()]
        warehouses = [w.to_dict() for w in self.db.query(Warehouse).all()]
        retail_stores = [r.to_dict() for r in self.db.query(RetailStore).all()]
        routes = [rt.to_dict() for rt in self.db.query(Route).all()]
        inventories = [inv.to_dict() for inv in self.db.query(Inventory).all()]
        shipments = [sh.to_dict() for sh in self.db.query(Shipment).all()]
        demands = [d.to_dict() for d in self.db.query(CustomerDemand).all()]
        disruptions = [dis.to_dict() for dis in self.db.query(Disruption).filter_by(status="ACTIVE").all()]
        purchase_orders = [po.to_dict() for po in self.db.query(PurchaseOrder).all()]

        total_demand = sum(d["target_quantity"] for d in demands)
        total_fulfilled = sum(d["fulfilled_quantity"] for d in demands)
        service_level = (total_fulfilled / total_demand * 100.0) if total_demand > 0 else 100.0

        return {
            "suppliers": suppliers,
            "warehouses": warehouses,
            "retail_stores": retail_stores,
            "routes": routes,
            "inventories": inventories,
            "shipments": shipments,
            "demands": demands,
            "disruptions": disruptions,
            "purchase_orders": purchase_orders,
            "kpis": {
                "overall_service_level_pct": round(service_level, 2),
                "total_demand": total_demand,
                "total_fulfilled": total_fulfilled,
                "unmet_demand": max(0.0, total_demand - total_fulfilled),
                "active_disruptions_count": len(disruptions)
            }
        }

    def update_inventory(self, location_type: str, location_id: str, sku: str, delta: float) -> Inventory:
        inv = self.db.query(Inventory).filter_by(
            location_type=location_type,
            location_id=location_id,
            sku=sku
        ).first()

        if not inv:
            inv = Inventory(
                location_type=location_type,
                location_id=location_id,
                sku=sku,
                quantity=max(0.0, delta),
                safety_stock=100.0
            )
            self.db.add(inv)
        else:
            inv.quantity = max(0.0, inv.quantity + delta)

        self.db.commit()
        self.db.refresh(inv)
        return inv
