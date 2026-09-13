from sqlalchemy.orm import Session
from backend.optimizer.recovery_solver import RecoveryOptimizer
from typing import Dict, Any, List

def evaluate_recovery_strategies(db: Session, target_store_id: str, sku: str, needed_quantity: float) -> List[Dict[str, Any]]:
    solver = RecoveryOptimizer(db)
    candidates = solver.generate_and_evaluate_recovery_plans(
        target_store_id=target_store_id,
        sku=sku,
        needed_quantity=needed_quantity
    )
    return candidates
