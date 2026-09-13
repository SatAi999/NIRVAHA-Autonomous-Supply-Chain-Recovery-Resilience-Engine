from sqlalchemy.orm import Session
from backend.simulation.engine import SimulationEngine
from backend.models.domain import Supplier, Route, Inventory, Disruption

def get_network_state(db: Session):
    sim = SimulationEngine(db)
    return sim.get_network_state()

def get_supplier_state(db: Session, supplier_id: str = None):
    query = db.query(Supplier)
    if supplier_id:
        query = query.filter_by(id=supplier_id)
    suppliers = query.all()
    return [s.to_dict() for s in suppliers]

def get_inventory_state(db: Session, sku: str = None, location_id: str = None):
    query = db.query(Inventory)
    if sku:
        query = query.filter_by(sku=sku)
    if location_id:
        query = query.filter_by(location_id=location_id)
    return [inv.to_dict() for inv in query.all()]

def get_route_status(db: Session, route_id: str = None):
    query = db.query(Route)
    if route_id:
        query = query.filter_by(id=route_id)
    return [r.to_dict() for r in query.all()]

def get_active_disruptions(db: Session):
    disruptions = db.query(Disruption).filter_by(status="ACTIVE").all()
    return [d.to_dict() for d in disruptions]
