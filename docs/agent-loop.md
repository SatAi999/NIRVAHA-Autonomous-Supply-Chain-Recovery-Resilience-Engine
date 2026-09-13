# Agent Operations Loop — NIRVAHA

The NIRVAHA agent operates on a continuous, closed-loop state machine powered by LangGraph / Controller logic.

---

## 5-Phase Operations Cycle

```
 ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
 │ 1. OBSERVE   │───>│2.INVESTIGATE │───>│ 3. OPTIMIZE  │───>│    4. ACT    │───>│  5. VERIFY   │
 └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
        ^                                                                               │
        └────────────────────────────── REPLAN (If Invalidated) ────────────────────────┘
```

### Phase 1: OBSERVE
- Scans the persistent SQLite Digital Twin using `get_active_disruptions()`.
- Identifies active bottlenecks, plant shutdowns, route closures, and demand spikes.
- Logs an `OBSERVE` trace step with detected evidence.

### Phase 2: INVESTIGATE
- Queries `trace_shortage_risk()` to identify unfulfilled customer demands and target retail stores.
- Evaluates alternative supply vectors via `find_alternative_suppliers()` and stock transfer routes via `find_transfer_opportunities()`.
- Logs an `INVESTIGATE` trace step detailing feasible options.

### Phase 3: OPTIMIZE
- Formulates multi-objective recovery strategies via `evaluate_recovery_strategies()`.
- Ranks candidate options based on weighted objective score (Cost, Lead Time, Carbon, SLA, Risk).
- Creates an active `Plan` version (e.g. Plan V1, Plan V2) tied to the current `environment_version`.

### Phase 4: ACT
- Executes state-mutating actions on the Digital Twin DB:
  - `create_purchase_order`: Issues PO to alternative supplier, deducts capacity, updates demand fulfillment.
  - `transfer_inventory`: Reallocates safety stock between distribution hubs via open routes.
- Handles atomic transaction rollbacks if any action fails.

### Phase 5: VERIFY
- Invokes `verify_action_execution()` to independently query SQLite tables.
- Assesses physical stock movement, shipment creation, and SLA impact.
- Completes cycle if verified; triggers `REPLAN` if plan invalidation or state conflict occurs.
