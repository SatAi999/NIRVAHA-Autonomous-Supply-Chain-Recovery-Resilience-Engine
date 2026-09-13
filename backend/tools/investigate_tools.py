from sqlalchemy.orm import Session
from backend.models.domain import Supplier, Route, Inventory, CustomerDemand, Warehouse

def trace_shortage_risk(db: Session):
    demands = db.query(CustomerDemand).all()
    shortages = []
    for d in demands:
        unmet = max(0.0, d.target_quantity - d.fulfilled_quantity)
        if unmet > 0:
            shortages.append({
                "store_id": d.store_id,
                "sku": d.sku,
                "target_quantity": d.target_quantity,
                "fulfilled_quantity": d.fulfilled_quantity,
                "unmet_quantity": unmet,
                "priority": d.priority,
                "deadline_hours": d.deadline_hours
            })
    return shortages

def find_alternative_suppliers(db: Session, sku: str):
    suppliers = db.query(Supplier).filter(
        Supplier.status == "ACTIVE",
        Supplier.available_capacity > 0
    ).all()
    
    alternatives = []
    for s in suppliers:
        if sku in s.supported_skus:
            alternatives.append(s.to_dict())
    return alternatives

def find_alternative_routes(db: Session, origin: str, destination: str):
    routes = db.query(Route).filter(
        Route.origin == origin,
        Route.status == "OPEN"
    ).all()
    return [r.to_dict() for r in routes]

def find_transfer_opportunities(db: Session, sku: str):
    warehouses = db.query(Warehouse).filter_by(operating_status="OPERATIONAL").all()
    opportunities = []
    for wh in warehouses:
        inv = db.query(Inventory).filter_by(
            location_type="WAREHOUSE",
            location_id=wh.id,
            sku=sku
        ).first()
        if inv and inv.quantity > inv.safety_stock:
            surplus = inv.quantity - inv.safety_stock
            opportunities.append({
                "warehouse_id": wh.id,
                "name": wh.name,
                "location": wh.location,
                "sku": sku,
                "available_surplus": surplus,
                "safety_stock": inv.safety_stock
            })
    return opportunities
