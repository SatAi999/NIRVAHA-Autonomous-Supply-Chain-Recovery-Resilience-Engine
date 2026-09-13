# Autonomous Replanning & Stale Plan Invalidation — NIRVAHA

NIRVAHA manages continuous changes in dynamic logistics environments by maintaining an explicit state version counter (`environment_version`).

---

## State Versioning & Plan Lifecycle

```
[Environment Version V1] ───> Active Plan V1 Created
          │
          ▼ Disruption Injected (e.g. Route Closure / Capacity Drop)
[Environment Version V2] ───> Plan V1 Status set to INVALIDATED
          │
          ▼ Agent Autonomous Wakeup & Re-optimization
[Environment Version V2] ───> Active Plan V2 Created & Executed
```

### Invalidation Triggers:
1. **Upstream Supplier Shutdown**: If active plan relies on a supplier that goes offline before PO execution.
2. **Capacity Degradation**: If supplier capacity drops below plan requirements.
3. **Route Blockage**: If transport corridor status changes to `CLOSED` or `CONGESTED`.
4. **Demand Surge**: If retail store demand increases, invalidating previous volume coverage.

### Plan Status States:
- `ACTIVE`: Currently valid plan generated for the latest `environment_version`.
- `INVALIDATED`: Plan rendered infeasible by subsequent downstream disruptions.
- `SUPERSEDED`: Plan replaced by a newer version during a recovery cycle.
- `EXECUTED`: Plan actions successfully committed and verified in DB.
