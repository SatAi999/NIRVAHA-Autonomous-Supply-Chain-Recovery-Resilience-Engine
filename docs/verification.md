# Independent Verification Engine — NIRVAHA

A core architectural principle of NIRVAHA is **Zero Blind Trust**. The agent does not assume an action succeeded simply because a tool returned a success message.

---

## Verification Protocol (`backend/verification/engine.py`)

```
 ┌───────────────────────────┐
 │   State Mutation Action   │ (e.g. create_purchase_order)
 └─────────────┬─────────────┘
               │
               v
 ┌───────────────────────────┐
 │   Database Commit to DB   │ (SQLite Persistent Twin)
 └─────────────┬─────────────┘
               │
               v
 ┌───────────────────────────┐
 │ Independent Audit Query   │ (Re-read PurchaseOrder & Shipment tables)
 └─────────────┬─────────────┘
               │
               v
 ┌───────────────────────────┐
 │ Postcondition Check & SLA │ Pass ➔ Log Trace & Event
 └───────────────────────────┘ Fail ➔ Trigger Rollback & Replan
```

### Audited Postconditions:
1. **PO Verification**: Queries `PurchaseOrder` table to confirm PO ID, SKU, quantity, supplier ID, and cost.
2. **Shipment Verification**: Confirms `Shipment` record exists in `IN_TRANSIT` state with valid ETA.
3. **Capacity Check**: Verifies `Supplier.available_capacity` was reduced by exact order volume.
4. **SLA Audit**: Re-calculates `fulfilled_quantity / target_quantity` on `CustomerDemand` table.
5. **State Version Audit**: Verifies plan was generated against the current `environment_version`.
