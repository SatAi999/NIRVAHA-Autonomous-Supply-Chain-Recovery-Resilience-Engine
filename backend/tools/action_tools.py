import uuid
import datetime
from sqlalchemy.orm import Session
from backend.models.domain import (
    Supplier, Warehouse, RetailStore, Route, Inventory,
    Shipment, PurchaseOrder, CustomerDemand, AuditLog
)

def create_purchase_order(
    db: Session,
    supplier_id: str,
    destination_id: str,
    sku: str,
    quantity: float,
    route_id: str
):
    supplier = db.query(Supplier).filter_by(id=supplier_id).first()
    if not supplier:
        return {"status": "FAILED", "reason": f"Supplier {supplier_id} not found"}

    if supplier.status != "ACTIVE" or supplier.available_capacity < quantity:
        return {
            "status": "FAILED",
            "reason": f"Supplier {supplier.name} has insufficient capacity ({supplier.available_capacity} available vs {quantity} requested)"
        }

    route = db.query(Route).filter_by(id=route_id).first()
    if not route or route.status != "OPEN":
        return {"status": "FAILED", "reason": f"Route {route_id} is closed or unavailable"}

    # Deduct capacity
    supplier.available_capacity -= quantity

    # Create PO
    po_id = f"PO-{uuid.uuid4().hex[:6].upper()}"
    cost = (supplier.unit_cost * quantity) + (route.transport_cost_per_unit * quantity)
    lead_time = (supplier.lead_time_days * 24.0) + route.travel_time_hours

    po = PurchaseOrder(
        id=po_id,
        supplier_id=supplier_id,
        destination_id=destination_id,
        sku=sku,
        quantity=quantity,
        cost=cost,
        expected_arrival_hours=lead_time,
        status="ISSUED"
    )
    db.add(po)

    # Create Shipment
    shipment_id = f"SHP-{uuid.uuid4().hex[:6].upper()}"
    carbon = (supplier.carbon_per_unit * quantity) + (route.carbon_factor_per_km_unit * route.distance_km * quantity)
    shipment = Shipment(
        id=shipment_id,
        origin=supplier.location,
        destination=destination_id,
        sku=sku,
        quantity=quantity,
        route_id=route_id,
        status="IN_TRANSIT",
        eta_hours=lead_time,
        cost=cost,
        carbon_impact=carbon
    )
    db.add(shipment)

    # Update Customer Demand Fulfillment
    demand = db.query(CustomerDemand).filter_by(store_id=destination_id, sku=sku).first()
    if demand:
        demand.fulfilled_quantity = min(demand.target_quantity, demand.fulfilled_quantity + quantity)

    # Audit Log
    audit = AuditLog(
        action_name="ACTION_CREATE_PURCHASE_ORDER",
        payload={
            "po_id": po_id,
            "shipment_id": shipment_id,
            "supplier_id": supplier_id,
            "destination_id": destination_id,
            "quantity": quantity,
            "cost": cost
        }
    )
    db.add(audit)
    db.commit()

    return {
        "status": "SUCCESS",
        "action": "CREATE_PURCHASE_ORDER",
        "po_id": po_id,
        "shipment_id": shipment_id,
        "quantity": quantity,
        "total_cost": cost,
        "eta_hours": lead_time,
        "carbon_impact_kg": carbon
    }


def transfer_inventory(
    db: Session,
    source_warehouse_id: str,
    destination_id: str,
    sku: str,
    quantity: float,
    route_id: str
):
    wh = db.query(Warehouse).filter_by(id=source_warehouse_id).first()
    if not wh or wh.operating_status != "OPERATIONAL":
        return {"status": "FAILED", "reason": f"Warehouse {source_warehouse_id} is not operational"}

    inv = db.query(Inventory).filter_by(
        location_type="WAREHOUSE",
        location_id=source_warehouse_id,
        sku=sku
    ).first()

    if not inv or (inv.quantity - quantity) < 0:
        return {"status": "FAILED", "reason": f"Insufficient stock at warehouse {source_warehouse_id}"}

    route = db.query(Route).filter_by(id=route_id).first()
    if not route or route.status != "OPEN":
        return {"status": "FAILED", "reason": f"Route {route_id} is closed"}

    # Mutate source stock
    inv.quantity -= quantity

    # Create Shipment
    shipment_id = f"SHP-TRF-{uuid.uuid4().hex[:6].upper()}"
    cost = route.transport_cost_per_unit * quantity
    lead_time = route.travel_time_hours
    carbon = route.carbon_factor_per_km_unit * route.distance_km * quantity

    shipment = Shipment(
        id=shipment_id,
        origin=wh.location,
        destination=destination_id,
        sku=sku,
        quantity=quantity,
        route_id=route_id,
        status="IN_TRANSIT",
        eta_hours=lead_time,
        cost=cost,
        carbon_impact=carbon
    )
    db.add(shipment)

    # Update Customer Demand Fulfillment
    demand = db.query(CustomerDemand).filter_by(store_id=destination_id, sku=sku).first()
    if demand:
        demand.fulfilled_quantity = min(demand.target_quantity, demand.fulfilled_quantity + quantity)

    audit = AuditLog(
        action_name="ACTION_TRANSFER_INVENTORY",
        payload={
            "shipment_id": shipment_id,
            "source_warehouse_id": source_warehouse_id,
            "destination_id": destination_id,
            "quantity": quantity
        }
    )
    db.add(audit)
    db.commit()

    return {
        "status": "SUCCESS",
        "action": "TRANSFER_INVENTORY",
        "shipment_id": shipment_id,
        "quantity": quantity,
        "total_cost": cost,
        "eta_hours": lead_time,
        "carbon_impact_kg": carbon
    }
