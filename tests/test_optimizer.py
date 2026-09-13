import pytest
from backend.database import SessionLocal
from backend.seed.seed_data import init_db, seed_database
from backend.optimizer.recovery_solver import RecoveryOptimizer

@pytest.fixture
def db():
    init_db()
    db_session = SessionLocal()
    seed_database(db_session)
    yield db_session
    db_session.close()

def test_recovery_optimizer_generates_plans(db):
    solver = RecoveryOptimizer(db)
    candidates = solver.generate_and_evaluate_recovery_plans(
        target_store_id="RET-DEL-01",
        sku="SKU-101",
        needed_quantity=1000.0
    )

    assert len(candidates) > 0
    top = candidates[0]
    assert "strategy_name" in top
    assert "cost" in top
    assert "delay_hours" in top
    assert "carbon_impact" in top
    assert "objective_score" in top
    assert top["resilience_score"] > 0
