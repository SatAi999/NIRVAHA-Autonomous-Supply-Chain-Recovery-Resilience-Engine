from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class AgentTaskState(BaseModel):
    task_id: str
    goal: str = "Restore Supply Chain Service Level to ≥ 95% while minimizing Cost, Lead Time, and Carbon Footprint."
    phase: str = "IDLE"  # IDLE, OBSERVING, INVESTIGATING, OPTIMIZING, EXECUTING, VERIFYING, REPLANNING, RECOVERED
    plan_version: int = 1
    active_disruptions: List[Dict[str, Any]] = Field(default_factory=list)
    shortages: List[Dict[str, Any]] = Field(default_factory=list)
    investigated_alternatives: List[Dict[str, Any]] = Field(default_factory=list)
    candidate_strategies: List[Dict[str, Any]] = Field(default_factory=list)
    selected_strategy: Optional[Dict[str, Any]] = None
    executed_actions: List[Dict[str, Any]] = Field(default_factory=list)
    verification_results: List[Dict[str, Any]] = Field(default_factory=list)
    traces: List[Dict[str, Any]] = Field(default_factory=list)
    resilience_score: float = 100.0
    status: str = "INITIALIZED"
