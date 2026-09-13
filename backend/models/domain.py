import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)  # e.g., "Chennai", "Bengaluru", "Pune"
    supported_skus = Column(JSON, nullable=False)  # list of SKUs
    available_capacity = Column(Float, nullable=False)
    max_capacity = Column(Float, nullable=False)
    unit_cost = Column(Float, nullable=False)  # in INR per unit
    lead_time_days = Column(Float, nullable=False)
    reliability_score = Column(Float, default=0.95)  # 0.0 to 1.0
    carbon_per_unit = Column(Float, default=1.2)  # kg CO2 per unit
    status = Column(String, default="ACTIVE")  # "ACTIVE", "DISRUPTED", "CAPACITY_REDUCED", "INACTIVE"
    disruption_risk = Column(Float, default=0.05)
    moq = Column(Integer, default=100)  # Minimum order quantity

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "supported_skus": self.supported_skus,
            "available_capacity": self.available_capacity,
            "max_capacity": self.max_capacity,
            "unit_cost": self.unit_cost,
            "lead_time_days": self.lead_time_days,
            "reliability_score": self.reliability_score,
            "carbon_per_unit": self.carbon_per_unit,
            "status": self.status,
            "disruption_risk": self.disruption_risk,
            "moq": self.moq
        }


class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)  # e.g. "Hyderabad", "Mumbai"
    capacity = Column(Float, nullable=False)
    throughput_capacity = Column(Float, nullable=False)
    safety_stock = Column(Float, default=500.0)
    operating_status = Column(String, default="OPERATIONAL")  # "OPERATIONAL", "DEGRADED", "SHUTDOWN"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "capacity": self.capacity,
            "throughput_capacity": self.throughput_capacity,
            "safety_stock": self.safety_stock,
            "operating_status": self.operating_status
        }


class RetailStore(Base):
    __tablename__ = "retail_stores"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)  # e.g., "Delhi", "Kolkata", "Ahmedabad"
    priority = Column(String, default="HIGH")  # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    target_sla = Column(Float, default=0.95)  # 95% service level
    deadline_hours = Column(Float, default=48.0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "priority": self.priority,
            "target_sla": self.target_sla,
            "deadline_hours": self.deadline_hours
        }


class Route(Base):
    __tablename__ = "routes"

    id = Column(String, primary_key=True)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    distance_km = Column(Float, nullable=False)
    travel_time_hours = Column(Float, nullable=False)
    transport_cost_per_unit = Column(Float, nullable=False)
    carbon_factor_per_km_unit = Column(Float, default=0.005)  # kg CO2 per km per unit
    capacity = Column(Float, nullable=False)
    status = Column(String, default="OPEN")  # "OPEN", "CONGESTED", "CLOSED", "DELAYED"
    risk_score = Column(Float, default=0.1)

    def to_dict(self):
        return {
            "id": self.id,
            "origin": self.origin,
            "destination": self.destination,
            "distance_km": self.distance_km,
            "travel_time_hours": self.travel_time_hours,
            "transport_cost_per_unit": self.transport_cost_per_unit,
            "carbon_factor_per_km_unit": self.carbon_factor_per_km_unit,
            "capacity": self.capacity,
            "status": self.status,
            "risk_score": self.risk_score
        }


class Inventory(Base):
    __tablename__ = "inventories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    location_type = Column(String, nullable=False)  # "WAREHOUSE", "RETAILER", "SUPPLIER"
    location_id = Column(String, nullable=False)
    sku = Column(String, nullable=False)
    quantity = Column(Float, nullable=False, default=0.0)
    safety_stock = Column(Float, default=100.0)

    def to_dict(self):
        return {
            "id": self.id,
            "location_type": self.location_type,
            "location_id": self.location_id,
            "sku": self.sku,
            "quantity": self.quantity,
            "safety_stock": self.safety_stock
        }


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(String, primary_key=True)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    sku = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    route_id = Column(String, nullable=False)
    status = Column(String, default="IN_TRANSIT")  # "PLANNED", "IN_TRANSIT", "DELIVERED", "DELAYED", "REROUTED"
    departure_time = Column(DateTime, default=datetime.datetime.utcnow)
    eta_hours = Column(Float, nullable=False)
    actual_arrival = Column(DateTime, nullable=True)
    cost = Column(Float, nullable=False)
    carbon_impact = Column(Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "origin": self.origin,
            "destination": self.destination,
            "sku": self.sku,
            "quantity": self.quantity,
            "route_id": self.route_id,
            "status": self.status,
            "departure_time": self.departure_time.isoformat() if self.departure_time else None,
            "eta_hours": self.eta_hours,
            "actual_arrival": self.actual_arrival.isoformat() if self.actual_arrival else None,
            "cost": self.cost,
            "carbon_impact": self.carbon_impact
        }


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(String, primary_key=True)
    supplier_id = Column(String, nullable=False)
    destination_id = Column(String, nullable=False)
    sku = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    cost = Column(Float, nullable=False)
    expected_arrival_hours = Column(Float, nullable=False)
    status = Column(String, default="ISSUED")  # "ISSUED", "CONFIRMED", "SHIPPED", "COMPLETED", "CANCELLED"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "supplier_id": self.supplier_id,
            "destination_id": self.destination_id,
            "sku": self.sku,
            "quantity": self.quantity,
            "cost": self.cost,
            "expected_arrival_hours": self.expected_arrival_hours,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class CustomerDemand(Base):
    __tablename__ = "customer_demands"

    id = Column(String, primary_key=True)
    store_id = Column(String, nullable=False)
    sku = Column(String, nullable=False)
    target_quantity = Column(Float, nullable=False)
    fulfilled_quantity = Column(Float, default=0.0)
    deadline_hours = Column(Float, default=48.0)
    priority = Column(String, default="HIGH")

    def to_dict(self):
        return {
            "id": self.id,
            "store_id": self.store_id,
            "sku": self.sku,
            "target_quantity": self.target_quantity,
            "fulfilled_quantity": self.fulfilled_quantity,
            "deadline_hours": self.deadline_hours,
            "priority": self.priority,
            "unmet_quantity": max(0.0, self.target_quantity - self.fulfilled_quantity)
        }


class Disruption(Base):
    __tablename__ = "disruptions"

    id = Column(String, primary_key=True)
    type = Column(String, nullable=False)  # "SUPPLIER_SHUTDOWN", "ROUTE_CLOSURE", "CAPACITY_REDUCTION", "DEMAND_SPIKE", "PRICE_SHOCK"
    entity_type = Column(String, nullable=False)  # "SUPPLIER", "ROUTE", "WAREHOUSE", "RETAILER"
    entity_id = Column(String, nullable=False)
    severity = Column(Float, default=1.0)  # 0.0 to 1.0 (1.0 = 100% loss/failure)
    description = Column(Text, nullable=False)
    status = Column(String, default="ACTIVE")  # "ACTIVE", "MITIGATED", "RESOLVED"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "severity": self.severity,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None
        }


class SystemState(Base):
    __tablename__ = "system_state"

    id = Column(Integer, primary_key=True, default=1)
    environment_version = Column(Integer, default=1)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "environment_version": self.environment_version,
            "last_updated": self.last_updated.isoformat() if self.last_updated else None
        }


class Plan(Base):
    __tablename__ = "plans"

    id = Column(String, primary_key=True)
    version = Column(Integer, nullable=False, default=1)
    created_at_env_version = Column(Integer, default=1)
    status = Column(String, default="ACTIVE")  # "ACTIVE", "INVALIDATED", "EXECUTED", "SUPERSEDED"
    goal = Column(Text, nullable=False)
    actions = Column(JSON, nullable=False)  # list of action dicts
    cost = Column(Float, default=0.0)
    delay_hours = Column(Float, default=0.0)
    carbon_impact = Column(Float, default=0.0)
    expected_sla = Column(Float, default=0.0)
    resilience_score = Column(Float, default=0.0)
    invalidation_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "version": self.version,
            "created_at_env_version": self.created_at_env_version,
            "status": self.status,
            "goal": self.goal,
            "actions": self.actions,
            "cost": self.cost,
            "delay_hours": self.delay_hours,
            "carbon_impact": self.carbon_impact,
            "expected_sla": self.expected_sla,
            "resilience_score": self.resilience_score,
            "invalidation_reason": self.invalidation_reason,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class AgentTrace(Base):
    __tablename__ = "agent_traces"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, nullable=False)
    step_index = Column(Integer, nullable=False)
    phase = Column(String, nullable=False)  # "OBSERVE", "INVESTIGATE", "GENERATE", "OPTIMIZE", "ACT", "VERIFY", "REPLAN"
    evidence = Column(Text, nullable=True)
    tool_called = Column(String, nullable=True)
    tool_input = Column(JSON, nullable=True)
    tool_output = Column(JSON, nullable=True)
    reasoning = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "task_id": self.task_id,
            "step_index": self.step_index,
            "phase": self.phase,
            "evidence": self.evidence,
            "tool_called": self.tool_called,
            "tool_input": self.tool_input,
            "tool_output": self.tool_output,
            "reasoning": self.reasoning,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    action_name = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "action_name": self.action_name,
            "payload": self.payload,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }
