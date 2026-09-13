import pytest
from backend.database import SessionLocal
from backend.seed.seed_data import init_db, seed_database
from backend.tools.registry import ToolRegistry

@pytest.fixture
def db():
    init_db()
    db_session = SessionLocal()
    seed_database(db_session)
    yield db_session
    db_session.close()

def test_tool_registry_execution(db):
    registry = ToolRegistry(db)
    tools = registry.list_available_tools()
    assert "get_network_state" in tools
    assert "create_purchase_order" in tools

    net = registry.execute_tool("get_network_state")
    assert net is not None

    po_res = registry.execute_tool(
        "create_purchase_order",
        {
            "supplier_id": "SUP-BLR-02",
            "destination_id": "RET-DEL-01",
            "sku": "SKU-101",
            "quantity": 500.0,
            "route_id": "R-BLR-HYD"
        }
    )
    assert po_res["status"] == "SUCCESS"
    assert "po_id" in po_res
