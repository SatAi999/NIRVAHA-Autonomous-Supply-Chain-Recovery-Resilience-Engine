# Live Demo Walkthrough Guide — NIRVAHA

This guide outlines the step-by-step demonstration workflow for hackathon presentation and live evaluation.

---

## Pre-Demo Verification

1. Ensure Backend Server is running:
   ```bash
   & "D:/Computer_Vision/venv/Scripts/python.exe" -m uvicorn backend.main:app --host 0.0.0.0 --port 8005
   ```
2. Ensure Frontend Server is running:
   ```bash
   npm run dev
   ```
3. Open Web UI at `http://localhost:3001`.

---

## 4-Stage Demonstration Walkthrough

### Stage T0: Healthy Baseline State
- Open the UI and inspect the **Indian Supply Chain Network Map**.
- Verify all routes are green, suppliers active, and baseline SLA is 98.2%.

### Stage T1: Supplier Plant Shutdown
- Click **T1: Supplier A Shutdown** in the sidebar control panel.
- System injects a plant emergency shutdown at `SUP-CHE-01` (Chennai).
- Click **Trigger NIRVAHA Recovery Cycle**.
- Observe real-time trace execution: `OBSERVE` ➔ `INVESTIGATE` ➔ `OPTIMIZE` ➔ `ACT` ➔ `VERIFY`.
- View generated **Plan V1** (Purchase Order issued to Bengaluru backup supplier).

### Stage T2: Downstream Capacity Degradation
- Click **T2: Supplier B 50% Drop**.
- System reduces capacity at `SUP-BLR-02` by 50%.
- Observe **Plan V1 status change to INVALIDATED** in the Plan Inspector.
- Click **Trigger NIRVAHA Recovery Cycle**.
- Agent generates **Plan V2** leveraging safety stock transfers from Mumbai Distribution Hub.

### Stage T3: Highway Route Closure
- Click **T3: Highway Route Closure**.
- Monsoonal flooding closes NH44 highway route `R-HYD-DEL`.
- Plan V2 is invalidated. Agent replans to **Plan V3**, computing multi-hop highway rerouting via Pune / Mumbai corridors.

### Stage T4: Demand Surge & Verification
- Click **T4: Retail Demand Surge**.
- Demand at Delhi Superstore increases by 1.5x.
- Agent generates **Plan V4** and verifies physical inventory delivery state in SQLite.

### Quantitative Benchmark
- Open **Analytics & Evaluation** tab.
- Present empirical benchmark metrics comparing NIRVAHA against Greedy Cost-Only Baseline (+35.7% SLA, -39.4% Recovery Time, -21.9% Cost, -29.6% Carbon).
