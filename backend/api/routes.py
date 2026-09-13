from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any

from backend.database import get_db
from backend.simulation.engine import SimulationEngine
from backend.simulation.disruptions import DisruptionEngine
from backend.agent.controller import NirvahaAgentController
from backend.evaluation.benchmark import EvaluationBenchmark
from backend.models.domain import AgentTrace, Plan

router = APIRouter(prefix="/api")

class DisruptionRequest(BaseModel):
    disruption_type: str  # "SUPPLIER_SHUTDOWN", "CAPACITY_REDUCTION", "ROUTE_CLOSURE", "DEMAND_SPIKE"
    entity_id: str
    severity: Optional[float] = 1.0
    description: Optional[str] = "Manual disruption injection"

class AgentRecoverRequest(BaseModel):
    llm_provider: Optional[str] = "ollama"

@router.get("/network-state")
def get_network_state(db: Session = Depends(get_db)):
    sim = SimulationEngine(db)
    return sim.get_network_state()

@router.post("/disruptions/inject")
def inject_disruption(req: DisruptionRequest, db: Session = Depends(get_db)):
    dis = DisruptionEngine(db)
    dtype = req.disruption_type.upper()
    try:
        if dtype == "SUPPLIER_SHUTDOWN":
            res = dis.inject_supplier_shutdown(req.entity_id, req.description)
        elif dtype == "CAPACITY_REDUCTION":
            res = dis.inject_supplier_capacity_reduction(req.entity_id, req.severity or 0.50, req.description)
        elif dtype == "ROUTE_CLOSURE":
            res = dis.inject_route_closure(req.entity_id, req.description)
        elif dtype == "DEMAND_SPIKE":
            res = dis.inject_demand_spike(req.entity_id, sku="SKU-101", multiplier=req.severity or 2.0, description=req.description)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported disruption type {dtype}")
        return {"status": "SUCCESS", "disruption": res.to_dict()}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/disruptions/reset")
def reset_environment(db: Session = Depends(get_db)):
    dis = DisruptionEngine(db)
    return dis.reset_all_disruptions()

@router.post("/agent/recover")
def run_agent_recovery(req: AgentRecoverRequest, db: Session = Depends(get_db)):
    controller = NirvahaAgentController(db, llm_provider=req.llm_provider)
    task_state = controller.run_autonomous_recovery_cycle()
    return task_state.model_dump()

@router.get("/agent/traces")
def get_agent_traces(db: Session = Depends(get_db)):
    traces = db.query(AgentTrace).order_by(AgentTrace.id.asc()).all()
    return [t.to_dict() for t in traces]

@router.get("/plans")
def get_plans(db: Session = Depends(get_db)):
    plans = db.query(Plan).order_by(Plan.created_at.desc()).all()
    return [p.to_dict() for p in plans]

@router.get("/evaluation/benchmark")
def run_evaluation_benchmark(db: Session = Depends(get_db)):
    bench = EvaluationBenchmark(db)
    return bench.run_benchmark()
