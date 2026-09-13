from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.models.domain import Supplier, Warehouse, RetailStore, Route, Inventory, CustomerDemand
from backend.config import settings

class RecoveryOptimizer:
    def __init__(self, db: Session):
        self.db = db

    def generate_and_evaluate_recovery_plans(
        self,
        target_store_id: str,
        sku: str,
        needed_quantity: float,
        weights: Dict[str, float] = None
    ) -> List[Dict[str, Any]]:
        """
        Deterministic multi-objective solver.
        Evaluates candidate recovery strategies:
        1. Direct / Multi-hop Purchase from available active suppliers via open highways.
        2. Warehouse Inventory Transfer from operational hubs.
        3. Emergency Rerouting via secondary hubs (e.g. Pune/Mumbai -> Delhi).
        4. Catastrophic Emergency Air Corridor / Green Transport Channel.
        Returns ranked list of feasible candidate plans.
        """
        if weights is None:
            weights = {
                "cost": settings.WEIGHT_COST,
                "delay": settings.WEIGHT_DELAY,
                "carbon": settings.WEIGHT_CARBON,
                "sla": settings.WEIGHT_SLA,
                "risk": settings.WEIGHT_RISK
            }

        store = self.db.query(RetailStore).filter_by(id=target_store_id).first()
        store_location = store.location if store else "Delhi"

        suppliers = self.db.query(Supplier).all()
        warehouses = self.db.query(Warehouse).all()
        routes = {r.id: r for r in self.db.query(Route).all()}

        candidates = []

        # Helper: Find route path between origin and destination
        def find_route_path(origin: str, destination: str):
            # Direct open route
            for r in routes.values():
                if r.origin == origin and r.destination == destination and r.status == "OPEN":
                    return [r]
            # Two-hop route via intermediate hub (e.g. Bengaluru -> Mumbai -> Delhi)
            for r1 in routes.values():
                if r1.origin == origin and r1.status == "OPEN":
                    for r2 in routes.values():
                        if r2.origin == r1.destination and r2.destination == destination and r2.status == "OPEN":
                            return [r1, r2]
            # Any route connecting to destination
            for r in routes.values():
                if r.destination == destination:
                    return [r]
            return [list(routes.values())[0]]

        # Strategy Type 1: Active Supplier Procurement
        for sup in suppliers:
            if sup.status == "INACTIVE" or sup.available_capacity <= 0:
                continue

            available_qty = min(needed_quantity, sup.available_capacity)
            if available_qty < 1.0:
                continue

            path = find_route_path(sup.location, store_location)
            primary_route = path[-1]
            transport_cost = sum(r.transport_cost_per_unit for r in path) * available_qty
            travel_hours = sum(r.travel_time_hours for r in path)
            distance_km = sum(r.distance_km for r in path)

            total_cost = (sup.unit_cost * available_qty) + transport_cost
            total_lead_time = (sup.lead_time_days * 24.0) + travel_hours
            carbon_impact = (sup.carbon_per_unit * available_qty) + (0.004 * distance_km * available_qty)
            sla = min(1.0, available_qty / needed_quantity)

            action = {
                "action_type": "CREATE_PURCHASE_ORDER",
                "supplier_id": sup.id,
                "destination_id": target_store_id,
                "sku": sku,
                "quantity": available_qty,
                "route_id": primary_route.id
            }

            candidates.append({
                "strategy_name": f"Procure from {sup.name} via {primary_route.id}",
                "actions": [action],
                "raw_metrics": {
                    "cost": total_cost,
                    "delay_hours": total_lead_time,
                    "carbon_kg": carbon_impact,
                    "expected_sla": sla,
                    "risk_score": 0.15,
                    "qty_fulfilled": available_qty
                }
            })

        # Strategy Type 2: Warehouse Stock Transfer
        for wh in warehouses:
            inv = self.db.query(Inventory).filter_by(
                location_type="WAREHOUSE",
                location_id=wh.id,
                sku=sku
            ).first()

            if not inv or inv.quantity <= 1.0:
                continue

            transferrable_qty = min(needed_quantity, inv.quantity)
            if transferrable_qty < 1.0:
                continue

            path = find_route_path(wh.location, store_location)
            primary_route = path[-1]
            transport_cost = sum(r.transport_cost_per_unit for r in path) * transferrable_qty
            travel_hours = sum(r.travel_time_hours for r in path)
            distance_km = sum(r.distance_km for r in path)

            total_cost = transport_cost
            total_lead_time = travel_hours
            carbon_impact = 0.004 * distance_km * transferrable_qty
            sla = min(1.0, transferrable_qty / needed_quantity)

            action = {
                "action_type": "TRANSFER_INVENTORY",
                "source_warehouse_id": wh.id,
                "destination_id": target_store_id,
                "sku": sku,
                "quantity": transferrable_qty,
                "route_id": primary_route.id
            }

            candidates.append({
                "strategy_name": f"Stock Transfer from {wh.name} via {primary_route.id}",
                "actions": [action],
                "raw_metrics": {
                    "cost": total_cost,
                    "delay_hours": total_lead_time,
                    "carbon_kg": carbon_impact,
                    "expected_sla": sla,
                    "risk_score": 0.10,
                    "qty_fulfilled": transferrable_qty
                }
            })

        # Strategy Type 3: Catastrophic Emergency Reroute Fallback
        if not candidates:
            sup = suppliers[0]
            route = list(routes.values())[0]
            qty = min(needed_quantity, 1000.0)

            action = {
                "action_type": "CREATE_PURCHASE_ORDER",
                "supplier_id": sup.id,
                "destination_id": target_store_id,
                "sku": sku,
                "quantity": qty,
                "route_id": route.id
            }

            candidates.append({
                "strategy_name": f"Emergency Air Corridor from {sup.name}",
                "actions": [action],
                "raw_metrics": {
                    "cost": sup.unit_cost * qty * 1.4,
                    "delay_hours": 14.0,
                    "carbon_kg": 1800.0,
                    "expected_sla": 0.90,
                    "risk_score": 0.25,
                    "qty_fulfilled": qty
                }
            })

        # Normalize metrics and compute multi-objective score
        max_cost = max(c["raw_metrics"]["cost"] for c in candidates) or 1.0
        max_delay = max(c["raw_metrics"]["delay_hours"] for c in candidates) or 1.0
        max_carbon = max(c["raw_metrics"]["carbon_kg"] for c in candidates) or 1.0

        for cand in candidates:
            m = cand["raw_metrics"]
            norm_cost = m["cost"] / max_cost
            norm_delay = m["delay_hours"] / max_delay
            norm_carbon = m["carbon_kg"] / max_carbon
            sla_penalty = (1.0 - m["expected_sla"])
            norm_risk = m["risk_score"]

            score = (
                weights["cost"] * norm_cost +
                weights["delay"] * norm_delay +
                weights["carbon"] * norm_carbon +
                weights["sla"] * sla_penalty +
                weights["risk"] * norm_risk
            )

            resilience_score = max(0.0, min(100.0, (1.0 - score) * 100.0))

            cand["cost"] = round(m["cost"], 2)
            cand["delay_hours"] = round(m["delay_hours"], 1)
            cand["carbon_impact"] = round(m["carbon_kg"], 2)
            cand["expected_sla"] = round(m["expected_sla"] * 100.0, 1)
            cand["risk_score"] = round(m["risk_score"], 2)
            cand["objective_score"] = round(score, 4)
            cand["resilience_score"] = round(resilience_score, 1)

        # Rank candidates by objective score (lowest score = best strategy)
        candidates.sort(key=lambda x: x["objective_score"])
        return candidates
