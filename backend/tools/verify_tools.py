from sqlalchemy.orm import Session
from backend.verification.engine import VerificationEngine
from typing import Dict, Any

def verify_action_execution(db: Session, action_result: Dict[str, Any]) -> Dict[str, Any]:
    verifier = VerificationEngine(db)
    return verifier.verify_action_execution(action_result)

def verify_plan_validity(db: Session, active_plan_actions: list) -> Dict[str, Any]:
    verifier = VerificationEngine(db)
    return verifier.audit_active_plan_validity(active_plan_actions)
