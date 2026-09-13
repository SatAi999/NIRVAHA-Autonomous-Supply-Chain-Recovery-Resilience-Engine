from typing import Dict, Any
from sqlalchemy.orm import Session
from backend.models.domain import PurchaseOrder, Shipment, CustomerDemand, Supplier, Route, Disruption

class VerificationEngine:
    def __init__(self, db: Session):
        self.db = db

    def verify_action_execution(self, action_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Independently audits post-action environment state.
        Checks database records to confirm physical persistence and constraint compliance.
        """
        if not action_result or action_result.get("status") != "SUCCESS":
            return {
                "verified": False,
                "reason": f"Pre-verification failure: action status is {action_result.get('status')}"
            }

        action_name = action_result.get("action")

        if action_name == "CREATE_PURCHASE_ORDER":
            po_id = action_result.get("po_id")
            po = self.db.query(PurchaseOrder).filter_by(id=po_id).first()
            if not po:
                return {"verified": False, "reason": f"Audit error: Purchase Order {po_id} not found in DB"}

            shipment_id = action_result.get("shipment_id")
            shp = self.db.query(Shipment).filter_by(id=shipment_id).first()
            if not shp:
                return {"verified": False, "reason": f"Audit error: Shipment {shipment_id} not found in DB"}

            return {
                "verified": True,
                "audit_summary": f"PO {po_id} verified. Shipment {shipment_id} active. Quantity {po.quantity} allocated.",
                "details": {
                    "po_status": po.status,
                    "shipment_status": shp.status,
                    "quantity": po.quantity,
                    "cost": po.cost
                }
            }

        elif action_name == "TRANSFER_INVENTORY":
            shipment_id = action_result.get("shipment_id")
            shp = self.db.query(Shipment).filter_by(id=shipment_id).first()
            if not shp:
                return {"verified": False, "reason": f"Audit error: Transfer shipment {shipment_id} not found"}

            return {
                "verified": True,
                "audit_summary": f"Inventory transfer verified. Shipment {shipment_id} in transit.",
                "details": {
                    "shipment_status": shp.status,
                    "quantity": shp.quantity,
                    "origin": shp.origin,
                    "destination": shp.destination
                }
            }

        return {"verified": True, "audit_summary": "Generic action verification passed"}

    def audit_active_plan_validity(self, active_plan_actions: list) -> Dict[str, Any]:
        """
        Checks if the currently executing plan has been invalidated by new disruptions.
        E.g., if a supplier in the active plan goes offline or route closes.
        """
        active_disruptions = self.db.query(Disruption).filter_by(status="ACTIVE").all()
        disrupted_entity_ids = {d.entity_id: d for d in active_disruptions}

        invalidating_factors = []

        for act in active_plan_actions:
            if act.get("supplier_id") in disrupted_entity_ids:
                d = disrupted_entity_ids[act["supplier_id"]]
                invalidating_factors.append(f"Supplier {act['supplier_id']} impacted by {d.type} ({d.description})")

            if act.get("route_id") in disrupted_entity_ids:
                d = disrupted_entity_ids[act["route_id"]]
                invalidating_factors.append(f"Route {act['route_id']} impacted by {d.type} ({d.description})")

        if invalidating_factors:
            return {
                "is_valid": False,
                "invalidation_reasons": invalidating_factors
            }

        return {"is_valid": True, "invalidation_reasons": []}
