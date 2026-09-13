import pytest
from backend.database import Base, engine, SessionLocal
from backend.seed.seed_data import init_db, seed_database
from backend.simulation.engine import SimulationEngine
from backend.simulation.disruptions import DisruptionEngine

@pytest.fixture
def db():
    init_db()
    db_session = SessionLocal()
    seed_database(db_session)
    yield db_session
    db_session.close()

def test_simulation_network_state(db):
    sim = SimulationEngine(db)
    state = sim.get_network_state()

    assert "suppliers" in state
    assert len(state["suppliers"]) == 4
    assert len(state["warehouses"]) == 3
    assert len(state["retail_stores"]) == 4
    assert len(state["routes"]) == 8
    assert state["kpis"]["overall_service_level_pct"] >= 0.0

def test_disruption_injection(db):
    dis_engine = DisruptionEngine(db)

    # Test supplier shutdown
    dis = dis_engine.inject_supplier_shutdown("SUP-CHE-01", description="Test shutdown")
    assert dis.type == "SUPPLIER_SHUTDOWN"
    assert dis.status == "ACTIVE"

    sim = SimulationEngine(db)
    state = sim.get_network_state()
    sup = next(s for s in state["suppliers"] if s["id"] == "SUP-CHE-01")
    assert sup["status"] == "DISRUPTED"
    assert sup["available_capacity"] == 0.0
