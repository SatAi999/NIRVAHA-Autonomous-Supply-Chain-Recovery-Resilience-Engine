from typing import Dict, Any, Callable
from sqlalchemy.orm import Session

from backend.tools import read_tools, investigate_tools, optimize_tools, action_tools, verify_tools

class ToolRegistry:
    def __init__(self, db: Session):
        self.db = db
        self._tools: Dict[str, Callable] = {
            # Read Tools
            "get_network_state": lambda **kwargs: read_tools.get_network_state(self.db),
            "get_supplier_state": lambda **kwargs: read_tools.get_supplier_state(self.db, kwargs.get("supplier_id")),
            "get_inventory_state": lambda **kwargs: read_tools.get_inventory_state(self.db, kwargs.get("sku"), kwargs.get("location_id")),
            "get_route_status": lambda **kwargs: read_tools.get_route_status(self.db, kwargs.get("route_id")),
            "get_active_disruptions": lambda **kwargs: read_tools.get_active_disruptions(self.db),

            # Investigation Tools
            "trace_shortage_risk": lambda **kwargs: investigate_tools.trace_shortage_risk(self.db),
            "find_alternative_suppliers": lambda **kwargs: investigate_tools.find_alternative_suppliers(self.db, kwargs.get("sku", "SKU-101")),
            "find_alternative_routes": lambda **kwargs: investigate_tools.find_alternative_routes(self.db, kwargs.get("origin", "Chennai"), kwargs.get("destination", "Hyderabad")),
            "find_transfer_opportunities": lambda **kwargs: investigate_tools.find_transfer_opportunities(self.db, kwargs.get("sku", "SKU-101")),

            # Optimization Tools
            "evaluate_recovery_strategies": lambda **kwargs: optimize_tools.evaluate_recovery_strategies(
                self.db,
                target_store_id=kwargs.get("target_store_id", "RET-DEL-01"),
                sku=kwargs.get("sku", "SKU-101"),
                needed_quantity=float(kwargs.get("needed_quantity", 1000.0))
            ),

            # Action Tools
            "create_purchase_order": lambda **kwargs: action_tools.create_purchase_order(
                self.db,
                supplier_id=kwargs.get("supplier_id"),
                destination_id=kwargs.get("destination_id"),
                sku=kwargs.get("sku"),
                quantity=float(kwargs.get("quantity", 0.0)),
                route_id=kwargs.get("route_id")
            ),
            "transfer_inventory": lambda **kwargs: action_tools.transfer_inventory(
                self.db,
                source_warehouse_id=kwargs.get("source_warehouse_id"),
                destination_id=kwargs.get("destination_id"),
                sku=kwargs.get("sku"),
                quantity=float(kwargs.get("quantity", 0.0)),
                route_id=kwargs.get("route_id")
            ),

            # Verification Tools
            "verify_action_execution": lambda **kwargs: verify_tools.verify_action_execution(self.db, kwargs.get("action_result", {})),
            "verify_plan_validity": lambda **kwargs: verify_tools.verify_plan_validity(self.db, kwargs.get("active_plan_actions", []))
        }

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any] = None) -> Any:
        if arguments is None:
            arguments = {}
        if tool_name not in self._tools:
            raise KeyError(f"Unknown tool: '{tool_name}'")
        return self._tools[tool_name](**arguments)

    def list_available_tools(self) -> list:
        return list(self._tools.keys())
