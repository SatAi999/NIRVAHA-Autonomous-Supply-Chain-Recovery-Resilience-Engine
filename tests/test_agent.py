import pytest
from backend.database import SessionLocal
from backend.seed.seed_data import init_db, seed_database
from backend.simulation.disruptions import DisruptionEngine
from backend.agent.controller import NirvahaAgentController

@pytest.fixture
def db():
    init_db()
    db_session = SessionLocal()
    seed_database(db_session)
    yield db_session
    db_session.close()

def test_autonomous_recovery_cycle(db):
    dis_engine = DisruptionEngine(db)
    dis_engine.inject_supplier_shutdown("SUP-CHE-01", description="Test shutdown")

    controller = NirvahaAgentController(db)
    task_state = controller.run_autonomous_recovery_cycle(task_id="TEST-TASK")

    assert task_state.phase == "RECOVERED"
    assert task_state.status == "SUCCESS"
    assert len(task_state.traces) >= 4
    assert task_state.selected_strategy is not None
