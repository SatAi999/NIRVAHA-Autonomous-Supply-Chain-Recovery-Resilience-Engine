# Multi-Objective Optimization Engine — NIRVAHA

NIRVAHA features a deterministic optimization engine (`backend/optimizer/recovery_solver.py`) that evaluates supply-chain recovery options under competing business objectives and physical constraints.

---

## 1. Objective Function

The optimizer evaluates candidate strategies using a multi-objective scoring formula:

$$\text{Objective Score} = w_{\text{cost}} \cdot \hat{C} + w_{\text{delay}} \cdot \hat{T} + w_{\text{carbon}} \cdot \hat{E} + w_{\text{sla}} \cdot (1 - \text{SLA}) + w_{\text{risk}} \cdot R$$

Where:
- $\hat{C}$: Normalized cost relative to max threshold (₹50,00,000)
- $\hat{T}$: Normalized lead time relative to deadline (hours)
- $\hat{E}$: Normalized carbon footprint (kg CO2)
- $\text{SLA}$: Fractional service level fulfilled (0.0 to 1.0)
- $R$: Disruption risk score of selected routes and suppliers (0.0 to 1.0)

Default Weight Configuration:
- $w_{\text{cost}} = 0.25$
- $w_{\text{delay}} = 0.25$
- $w_{\text{carbon}} = 0.15$
- $w_{\text{sla}} = 0.25$
- $w_{\text{risk}} = 0.10$

---

## 2. Hard Constraints

1. **Capacity Limit**: Requested quantity $\le$ Supplier available capacity.
2. **Route Openness**: Selected transport routes must be in `OPEN` status.
3. **Minimum Order Quantity (MOQ)**: Purchase order quantity $\ge$ Supplier MOQ.
4. **Safety Stock Limit**: Warehouse stock transfers cannot reduce inventory below warehouse safety stock.
5. **Multi-Hop Rerouting**: Evaluates direct routes or two-hop intermediate highway nodes (e.g., Pune ➔ Mumbai ➔ Delhi) when primary corridors are closed.
