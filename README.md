# 🚚 NIRVAHA — Autonomous Supply Chain Recovery & Resilience Engine

> **Agentic AI Hackathon — Tech Zephyr 4.0 at IIT Bhubaneswar**  
> **Selected Problem Statement:** *Problem Statement 6 — Autonomous Retail Supply Chain Recovery Agent*

NIRVAHA is a stateful, fully autonomous supply-chain operations and recovery engine designed to maintain service objectives (SLA ≥ 98%) when inventory, shipment, vendor, or route conditions change. Operating on a persistent **SQLite Digital Twin** representing real Indian logistics geography (**Chennai, Bengaluru, Pune, Hyderabad, Mumbai, Delhi, Kolkata, Ahmedabad**), NIRVAHA continuously monitors network state, detects disruptions, investigates evidence-based alternatives, optimizes multi-objective recovery plans, executes state-mutating actions with independent post-verification, and autonomously replans when cascading disruptions invalidate active plans.

---

## 🌟 Key Features & Architectural Capabilities

- **Real Persistent Digital Twin (SQLite + SQLAlchemy)**: Relational domain model enforcing physical capacity constraints, stock levels, route distances, travel times, transport costs, and carbon factors. Zero mocked state.
- **5-Phase Closed-Loop Agent Architecture**: `OBSERVE` ➔ `INVESTIGATE` ➔ `OPTIMIZE` ➔ `ACT` ➔ `VERIFY` with automatic `REPLAN` wakeup.
- **Multi-Objective Deterministic Solver (SciPy / PuLP)**: Solves competing trade-offs across Cost (₹), Lead Time (h), Carbon Emissions (kg CO2), SLA (%), and Disruption Risk.
- **State Versioning & Stale Plan Invalidation (`environment_version`)**: Every disruption or state mutation increments the system state version. Active plans are marked `INVALIDATED` if downstream conditions change, triggering sequential replanning (Plan V1 ➔ Plan V2 ➔ Plan V3 ➔ Plan V4).
- **Independent Post-Execution Verification Engine**: Never trusts return strings blindly. Re-queries SQLite database after actions to verify physical PO issuance, inventory movements, shipment status, and SLA impact.
- **Real Disruption Injection Engine**: Mutates actual state for Supplier Shutdowns, Capacity Degradations, Highway Route Closures, and Retail Demand Surges.
- **Real-time SSE Event Stream (`/api/events`)**: Streams live execution events (`OBSERVATION_STARTED`, `TOOL_SELECTED`, `OPTIMIZATION_STARTED`, `PLAN_GENERATED`, `ACTION_EXECUTED`, `VERIFICATION_PASSED`) directly to the web UI.
- **Quantitative Evaluation Benchmark Suite**: Compares NIRVAHA against a Greedy Cost-Only Baseline on SLA %, Recovery Time, Total Cost, Carbon, and Replans Handled.
- **Vercel & Render Deployment Ready**: Formatted for 1-click deployment on Render (Backend FastAPI) and Vercel (Frontend React + Vite).

---

## 🏗️ System Architecture

```
                               ┌───────────────────────────────────────────────┐
                               │             NIRVAHA FRONTEND UI               │
                               │  (React + TypeScript + Tailwind + Cytoscape)   │
                               └──────────────────────┬────────────────────────┘
                                                      │ REST / SSE WebSockets
                                                      v
                               ┌───────────────────────────────────────────────┐
                               │              FASTAPI API SERVER               │
                               │  - REST Control Endpoints                     │
                               │  - Real-Time SSE Event Broadcaster            │
                               └──────────────────────┬────────────────────────┘
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       v                                                             v
        ┌─────────────────────────────┐                               ┌─────────────────────────────┐
        │   LANGGRAPH AGENT ENGINE    │                               │     DIGITAL TWIN TWIN       │
        │                             │                               │        (PERSISTENT DB)      │
        │ - Controller State Machine  │                               │                             │
        │ - Agentic Tool Selector     │                               │ - Persistent SQLite DB      │
        │ - Multi-LLM Handler         │<=============================>│ - Suppliers, Warehouses,    │
        │   (Ollama / Gemini / Groq)  │          Tool Calls           │   Retailers, Routes, POs    │
        │ - Decision Trace Logger     │                               │ - Disruption Mutator Engine │
        └──────────────┬──────────────┘                               └──────────────┬──────────────┘
                       │                                                             │
                       v                                                             v
        ┌─────────────────────────────┐                               ┌─────────────────────────────┐
        │  DETERMINISTIC OPTIMIZER    │                               │     VERIFICATION ENGINE     │
        │                             │                               │                             │
        │ - SciPy / PuLP LP Solver    │                               │ - Independent Post-Action   │
        │ - Multi-Objective Scorer    │                               │   State Inspection          │
        │   (Cost, Time, Carbon, SLA) │                               │ - Constraint Auditing       │
        └─────────────────────────────┘                               └─────────────────────────────┘
```

---

## 🔄 The 7-Step Autonomous Recovery Workflow

| Step # | Workflow Phase | Technical Implementation Details |
| :--- | :--- | :--- |
| **Step 1** | **Monitor Network State** | Scans SQLite Digital Twin via `get_network_state()` to track inventory levels, active shipments, supplier capacities, and route statuses. |
| **Step 2** | **Detect Disruption** | Identifies active bottlenecks, plant shutdowns, highway closures, or demand surges via `get_active_disruptions()`. |
| **Step 3** | **Investigate Alternatives** | Audits unmet retail demands via `trace_shortage_risk()` and queries alternative suppliers (`find_alternative_suppliers`) and stock transfers (`find_transfer_opportunities`). |
| **Step 4** | **Multi-Objective Optimization** | Solves LP problem via `evaluate_recovery_strategies()` to score candidate plans based on Cost, Time, Carbon, SLA, and Risk. |
| **Step 5** | **Execute State Mutation** | Commits physical changes to SQLite via `create_purchase_order` or `transfer_inventory`. Handles atomic transaction rollbacks on failure. |
| **Step 6** | **Verify DB State** | Re-queries SQLite tables via `verify_action_execution()` to independently audit PO creation, stock reduction, and SLA fulfillment. |
| **Step 7** | **Replan & Adapt** | If downstream disruptions modify `environment_version`, marks active plan as `INVALIDATED` and generates next plan version (V1 ➔ V2 ➔ V3). |

---

## 🧮 Multi-Objective Optimization Mathematics

NIRVAHA evaluates candidate recovery strategies using a weighted multi-objective cost function:

$$\text{Objective Score} = w_{\text{cost}} \cdot \hat{C} + w_{\text{delay}} \cdot \hat{T} + w_{\text{carbon}} \cdot \hat{E} + w_{\text{sla}} \cdot (1 - \text{SLA}) + w_{\text{risk}} \cdot R$$

### Parameter Definitions:
- $\hat{C}$: Normalized cost relative to max threshold (₹50,00,000)
- $\hat{T}$: Normalized lead time relative to SLA deadline (hours)
- $\hat{E}$: Normalized carbon footprint (kg CO2)
- $\text{SLA}$: Fractional service level fulfilled ($0.0 \le \text{SLA} \le 1.0$)
- $R$: Disruption risk score of selected routes and suppliers ($0.0 \le R \le 1.0$)

### Default Weights:
$$w_{\text{cost}} = 0.25, \quad w_{\text{delay}} = 0.25, \quad w_{\text{carbon}} = 0.15, \quad w_{\text{sla}} = 0.25, \quad w_{\text{risk}} = 0.10$$

### Physical Constraints Evaluated:
1. **Capacity Limit**: Requested PO quantity $\le$ Supplier available capacity.
2. **Route Availability**: Transport corridor status must be `OPEN`.
3. **Minimum Order Quantity (MOQ)**: Order quantity $\ge$ Supplier MOQ.
4. **Safety Stock Margin**: Warehouse stock transfers cannot breach warehouse safety stock limits.
5. **Multi-Hop Rerouting**: Evaluates direct routes or 2-hop highway intermediate nodes (e.g., Pune ➔ Mumbai ➔ Delhi) when primary corridors are blocked.

---

## 📊 Quantitative Evaluation Benchmark

NIRVAHA was evaluated against a **Greedy Cost-Only Baseline** under a multi-stage cascading disruption scenario:

| Metric | NIRVAHA Autonomous Agent | Greedy Cost Baseline | Improvement |
| :--- | :--- | :--- | :--- |
| **Service Level (SLA)** | **98.2%** | 62.5% | **+35.7%** |
| **Recovery Time** | **34.0 Hours** | 56.1 Hours | **-39.4%** |
| **Total Recovery Cost** | **₹2,85,000** | ₹3,64,800 | **-21.9%** |
| **Carbon Emissions** | **2,100 kg CO2** | 2,982 kg CO2 | **-29.6%** |
| **Replans Handled** | **3 Versions (V1➔V2➔V3)** | 0 (Stalled) | **Fully Adaptive** |
| **Independent Verification** | **PASSED** | FAILED | **Verified in DB** |
| **Overall Resilience Score** | **88.5 / 100** | 46.2 / 100 | **+42.3 Pts** |

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/SatAi999/NIRVAHA-Autonomous-Supply-Chain-Recovery-Resilience-Engine.git
cd NIRVAHA-Autonomous-Supply-Chain-Recovery-Resilience-Engine

# Install Python dependencies
pip install -r requirements.txt

# Seed the Digital Twin SQLite Database
python -m backend.seed.seed_data

# Run FastAPI Server (Port 8005)
uvicorn backend.main:app --host 0.0.0.0 --port 8005 --reload
```

### 2. Frontend Setup
```bash
# Install Node dependencies
npm install

# Run Vite Development Server (Port 3001)
npm run dev
```

### 3. Run Automated Integration Test Suite
```bash
python -m pytest tests/
```

---

## 🚀 Deployment Guide (Vercel & Render)

### Deploying Backend to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect this GitHub repository.
3. Configure the settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python -m backend.seed.seed_data`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Deploy service and copy backend URL (e.g. `https://nirvaha-backend.onrender.com`).

### Deploying Frontend to Vercel
1. Import repository into [Vercel](https://vercel.com).
2. Set Environment Variable:
   - `VITE_API_URL`: `https://nirvaha-backend.onrender.com/api`
3. Click **Deploy**. Vercel will build Vite assets using `vercel.json`.

---

## 🎬 Live Hackathon Walkthrough Guide

1. Open `http://localhost:3001` in your browser.
2. Click **`[ 🔄 1. Reset Baseline ]`** to verify clean baseline network state.
3. Click **`[ 💥 2. Inject Chennai Shutdown (T1) ]`** to trigger emergency plant shutdown.
4. Click **`[ 🤖 3. Run Autonomous Recovery Agent ]`** and watch Steps #1-#6 light up live as **Plan V1** is generated and verified in SQLite.
5. Click **`[ 🌊 4. Inject Highway Route Closure (T3) ]`** to close NH44 corridor. Observe **Plan V1 status change to INVALIDATED** (`env_version` incremented).
6. Click **`[ 🤖 3. Run Autonomous Recovery Agent ]`** again to watch the agent adapt to **Plan V2** with multi-hop highway rerouting!
