from sqlalchemy.orm import Session
from backend.database import Base, engine, SessionLocal
from backend.models.domain import (
    Supplier, Warehouse, RetailStore, Route, Inventory,
    Shipment, CustomerDemand, Disruption, Plan, AgentTrace, AuditLog, SystemState
)

from sqlalchemy import text

def init_db():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE plans ADD COLUMN created_at_env_version INTEGER DEFAULT 1"))
            conn.commit()
        except Exception:
            pass
        try:
            conn.execute(text("CREATE TABLE IF NOT EXISTS system_state (id INTEGER PRIMARY KEY, environment_version INTEGER DEFAULT 1, last_updated DATETIME)"))
            conn.commit()
        except Exception:
            pass

def seed_database(db: Session):
    # Clear existing data
    db.query(AgentTrace).delete()
    db.query(AuditLog).delete()
    db.query(Plan).delete()
    db.query(Disruption).delete()
    db.query(Shipment).delete()
    db.query(CustomerDemand).delete()
    db.query(Inventory).delete()
    db.query(Route).delete()
    db.query(RetailStore).delete()
    db.query(Warehouse).delete()
    db.query(Supplier).delete()
    db.query(SystemState).delete()
    db.commit()

    # Seed SystemState
    db.add(SystemState(id=1, environment_version=1))
    db.commit()

    # 1. Suppliers
    suppliers = [
        Supplier(
            id="SUP-CHE-01",
            name="Chennai Tech Supplies Ltd",
            location="Chennai",
            supported_skus=["SKU-101", "SKU-102"],
            available_capacity=5000.0,
            max_capacity=5000.0,
            unit_cost=1200.0,
            lead_time_days=2.0,
            reliability_score=0.96,
            carbon_per_unit=1.4,
            status="ACTIVE",
            disruption_risk=0.08,
            moq=200
        ),
        Supplier(
            id="SUP-BLR-02",
            name="Bengaluru Micro Devices",
            location="Bengaluru",
            supported_skus=["SKU-101", "SKU-103"],
            available_capacity=4000.0,
            max_capacity=4000.0,
            unit_cost=1350.0,
            lead_time_days=1.5,
            reliability_score=0.98,
            carbon_per_unit=1.1,
            status="ACTIVE",
            disruption_risk=0.04,
            moq=100
        ),
        Supplier(
            id="SUP-PUN-03",
            name="Pune Auto & Component Corp",
            location="Pune",
            supported_skus=["SKU-102", "SKU-104"],
            available_capacity=6000.0,
            max_capacity=6000.0,
            unit_cost=1100.0,
            lead_time_days=3.0,
            reliability_score=0.92,
            carbon_per_unit=1.6,
            status="ACTIVE",
            disruption_risk=0.10,
            moq=300
        ),
        Supplier(
            id="SUP-HYD-04",
            name="Hyderabad Pharma & Med Supply",
            location="Hyderabad",
            supported_skus=["SKU-105"],
            available_capacity=3000.0,
            max_capacity=3000.0,
            unit_cost=850.0,
            lead_time_days=1.0,
            reliability_score=0.99,
            carbon_per_unit=0.9,
            status="ACTIVE",
            disruption_risk=0.02,
            moq=50
        )
    ]
    db.add_all(suppliers)

    # 2. Warehouses
    warehouses = [
        Warehouse(
            id="WH-HYD-01",
            name="Hyderabad Central Distribution Hub",
            location="Hyderabad",
            capacity=20000.0,
            throughput_capacity=5000.0,
            safety_stock=1500.0,
            operating_status="OPERATIONAL"
        ),
        Warehouse(
            id="WH-BOM-02",
            name="Mumbai Western Hub",
            location="Mumbai",
            capacity=25000.0,
            throughput_capacity=6000.0,
            safety_stock=2000.0,
            operating_status="OPERATIONAL"
        ),
        Warehouse(
            id="WH-DEL-03",
            name="NCR Northern Logistics Center",
            location="Delhi",
            capacity=18000.0,
            throughput_capacity=4500.0,
            safety_stock=1200.0,
            operating_status="OPERATIONAL"
        )
    ]
    db.add_all(warehouses)

    # 3. Retail Stores
    retail_stores = [
        RetailStore(
            id="RET-DEL-01",
            name="Delhi Capital Superstore",
            location="Delhi",
            priority="CRITICAL",
            target_sla=0.98,
            deadline_hours=36.0
        ),
        RetailStore(
            id="RET-KOL-02",
            name="Kolkata Metro Hub Store",
            location="Kolkata",
            priority="HIGH",
            target_sla=0.95,
            deadline_hours=48.0
        ),
        RetailStore(
            id="RET-AMD-03",
            name="Ahmedabad Industrial Store",
            location="Ahmedabad",
            priority="HIGH",
            target_sla=0.95,
            deadline_hours=48.0
        ),
        RetailStore(
            id="RET-BLR-04",
            name="Bengaluru Tech Park Store",
            location="Bengaluru",
            priority="MEDIUM",
            target_sla=0.90,
            deadline_hours=72.0
        )
    ]
    db.add_all(retail_stores)

    # 4. Routes
    routes = [
        Route(id="R-CHE-HYD", origin="Chennai", destination="Hyderabad", distance_km=620, travel_time_hours=12.0, transport_cost_per_unit=45.0, carbon_factor_per_km_unit=0.004, capacity=5000, status="OPEN", risk_score=0.05),
        Route(id="R-BLR-HYD", origin="Bengaluru", destination="Hyderabad", distance_km=570, travel_time_hours=10.0, transport_cost_per_unit=40.0, carbon_factor_per_km_unit=0.0035, capacity=4500, status="OPEN", risk_score=0.04),
        Route(id="R-PUN-BOM", origin="Pune", destination="Mumbai", distance_km=150, travel_time_hours=3.5, transport_cost_per_unit=15.0, carbon_factor_per_km_unit=0.002, capacity=6000, status="OPEN", risk_score=0.02),
        Route(id="R-HYD-DEL", origin="Hyderabad", destination="Delhi", distance_km=1550, travel_time_hours=28.0, transport_cost_per_unit=110.0, carbon_factor_per_km_unit=0.005, capacity=4000, status="OPEN", risk_score=0.08),
        Route(id="R-HYD-KOL", origin="Hyderabad", destination="Kolkata", distance_km=1480, travel_time_hours=26.0, transport_cost_per_unit=105.0, carbon_factor_per_km_unit=0.0048, capacity=3500, status="OPEN", risk_score=0.07),
        Route(id="R-BOM-DEL", origin="Mumbai", destination="Delhi", distance_km=1420, travel_time_hours=24.0, transport_cost_per_unit=98.0, carbon_factor_per_km_unit=0.0045, capacity=5000, status="OPEN", risk_score=0.06),
        Route(id="R-BOM-AMD", origin="Mumbai", destination="Ahmedabad", distance_km=530, travel_time_hours=9.0, transport_cost_per_unit=38.0, carbon_factor_per_km_unit=0.003, capacity=4000, status="OPEN", risk_score=0.03),
        Route(id="R-HYD-BLR", origin="Hyderabad", destination="Bengaluru", distance_km=570, travel_time_hours=10.0, transport_cost_per_unit=40.0, carbon_factor_per_km_unit=0.0035, capacity=4000, status="OPEN", risk_score=0.04)
    ]
    db.add_all(routes)

    # 5. Inventories
    inventories = [
        Inventory(location_type="WAREHOUSE", location_id="WH-HYD-01", sku="SKU-101", quantity=3500.0, safety_stock=1000.0),
        Inventory(location_type="WAREHOUSE", location_id="WH-HYD-01", sku="SKU-102", quantity=2000.0, safety_stock=800.0),
        Inventory(location_type="WAREHOUSE", location_id="WH-BOM-02", sku="SKU-101", quantity=4000.0, safety_stock=1200.0),
        Inventory(location_type="WAREHOUSE", location_id="WH-BOM-02", sku="SKU-104", quantity=3000.0, safety_stock=1000.0),
        Inventory(location_type="WAREHOUSE", location_id="WH-DEL-03", sku="SKU-101", quantity=1500.0, safety_stock=1000.0),
        Inventory(location_type="RETAILER", location_id="RET-DEL-01", sku="SKU-101", quantity=800.0, safety_stock=500.0),
        Inventory(location_type="RETAILER", location_id="RET-KOL-02", sku="SKU-101", quantity=600.0, safety_stock=400.0),
        Inventory(location_type="RETAILER", location_id="RET-AMD-03", sku="SKU-104", quantity=700.0, safety_stock=300.0)
    ]
    db.add_all(inventories)

    # 6. Customer Demands
    demands = [
        CustomerDemand(id="DEM-DEL-101", store_id="RET-DEL-01", sku="SKU-101", target_quantity=2500.0, fulfilled_quantity=800.0, deadline_hours=36.0, priority="CRITICAL"),
        CustomerDemand(id="DEM-KOL-101", store_id="RET-KOL-02", sku="SKU-101", target_quantity=1800.0, fulfilled_quantity=600.0, deadline_hours=48.0, priority="HIGH"),
        CustomerDemand(id="DEM-AMD-104", store_id="RET-AMD-03", sku="SKU-104", target_quantity=1500.0, fulfilled_quantity=700.0, deadline_hours=48.0, priority="HIGH"),
        CustomerDemand(id="DEM-BLR-103", store_id="RET-BLR-04", sku="SKU-103", target_quantity=1200.0, fulfilled_quantity=1200.0, deadline_hours=72.0, priority="MEDIUM")
    ]
    db.add_all(demands)

    db.commit()
    print("Database seeded successfully with realistic Indian Supply Chain Digital Twin data!")

if __name__ == "__main__":
    init_db()
    db = SessionLocal()
    seed_database(db)
    db.close()
