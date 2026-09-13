# Typed Tool Registry — NIRVAHA

NIRVAHA implements a typed tool registry (`backend/tools/`) where every tool accepts structured arguments, executes queries or mutations against SQLite, and returns json-serializable evidence.

---

## 1. Network Observation & Diagnostic Tools

| Tool Name | Type | Description |
| :--- | :--- | :--- |
| `get_network_state` | Read | Retrieves full network graph (Suppliers, Hubs, Stores, Routes). |
| `get_supplier_state` | Read | Returns status, capacity, cost, lead time, and reliability for all suppliers. |
| `get_inventory_state` | Read | Audits stock levels across warehouses and retail locations. |
| `get_route_status` | Read | Audits route open/closed status, distance, travel time, and risk scores. |
| `get_active_disruptions` | Read | Lists all active disruptions in the environment. |

---

## 2. Root Cause Investigation Tools

| Tool Name | Type | Description |
| :--- | :--- | :--- |
| `trace_shortage_risk` | Investigation | Identifies retail stores with unmet demand and critical SLA deadlines. |
| `find_alternative_suppliers` | Investigation | Finds active suppliers supporting the required SKU with available capacity. |
| `find_alternative_routes` | Investigation | Computes direct and two-hop highway routes between origin and destination. |
| `find_transfer_opportunities` | Investigation | Identifies operational warehouses holding excess stock above safety threshold. |

---

## 3. Optimization & Action Tools

| Tool Name | Type | Description |
| :--- | :--- | :--- |
| `evaluate_recovery_strategies` | Optimization | Solves multi-objective optimization problem to rank recovery candidates. |
| `create_purchase_order` | Action (Mutating) | Creates Purchase Order & Shipment in DB, deducts supplier capacity, updates demand. |
| `transfer_inventory` | Action (Mutating) | Deducts warehouse inventory, creates transfer Shipment in DB, updates store demand. |

---

## 4. Verification & Validation Tools

| Tool Name | Type | Description |
| :--- | :--- | :--- |
| `verify_action_execution` | Verification | Re-queries SQLite DB to verify physical PO/Shipment creation and SLA impact. |
| `verify_plan_validity` | Verification | Audits if an active Plan's underlying suppliers and routes remain operational. |
