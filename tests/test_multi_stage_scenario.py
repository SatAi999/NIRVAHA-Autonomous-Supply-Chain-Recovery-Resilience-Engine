import pytest
from backend.database import SessionLocal
from backend.seed.seed_data import init_db, seed_database
from backend.simulation.disruptions import DisruptionEngine
from backend.agent.controller import NirvahaAgentController
from backend.models.domain import Plan, SystemState

def test_multi_stage_recovery_and_plan_invalidation():
    init_db()
    db = SessionLocal()
    seed_database(db)

    dis_engine = DisruptionEngine(db)
    controller = NirvahaAgentController(db)

    # Stage T0: Verify baseline environment
    state_t0 = db.query(SystemState).first()
    assert state_t0.environment_version == 1

    # Stage T1: Disruption 1 - Supplier Shutdown (SUP-CHE-01)
    dis1 = dis_engine.inject_supplier_shutdown("SUP-CHE-01", description="Chennai typhoon shutdown")
    assert dis1.status == "ACTIVE"
    
    state_t1_cycle = controller.run_autonomous_recovery_cycle(task_id="TASK-STAGE-1")
    assert state_t1_cycle.plan_version == 1
    
    plan_v1 = db.query(Plan).filter_by(version=1).first()
    assert plan_v1 is not None
    assert plan_v1.status == "ACTIVE"

    # Stage T2: Disruption 2 - Supplier B 50% Capacity Reduction (SUP-BLR-02)
    dis2 = dis_engine.inject_supplier_capacity_reduction("SUP-BLR-02", reduction_pct=0.50, description="Bengaluru chip shortage")
    
    # Check that Plan V1 was automatically invalidated
    db.refresh(plan_v1)
    assert plan_v1.status == "INVALIDATED"
    assert "env_version" in plan_v1.invalidation_reason

    # Run Recovery Cycle for Stage T2 -> Plan V2
    state_t2_cycle = controller.run_autonomous_recovery_cycle(task_id="TASK-STAGE-2")
    assert state_t2_cycle.plan_version == 2
    
    plan_v2 = db.query(Plan).filter_by(version=2).first()
    assert plan_v2 is not None
    assert plan_v2.status == "ACTIVE"

    # Stage T3: Disruption 3 - Route R-HYD-DEL Closure
    dis3 = dis_engine.inject_route_closure("R-HYD-DEL", description="Monsoon flooding on NH44")
    
    # Check that Plan V2 was automatically invalidated
    db.refresh(plan_v2)
    assert plan_v2.status == "INVALIDATED"

    # Run Recovery Cycle for Stage T3 -> Plan V3
    state_t3_cycle = controller.run_autonomous_recovery_cycle(task_id="TASK-STAGE-3")
    assert state_t3_cycle.plan_version == 3

    plan_v3 = db.query(Plan).filter_by(version=3).first()
    assert plan_v3 is not None
    assert plan_v3.status == "ACTIVE"

    # Stage T4: Disruption 4 - Demand Spike at Retail Store
    dis4 = dis_engine.inject_demand_spike(store_id="RET-DEL-01", sku="SKU-101", multiplier=1.5, description="Festival spike")
    
    # Check that Plan V3 was automatically invalidated
    db.refresh(plan_v3)
    assert plan_v3.status == "INVALIDATED"

    # Run Recovery Cycle for Stage T4 -> Plan V4
    state_t4_cycle = controller.run_autonomous_recovery_cycle(task_id="TASK-STAGE-4")
    assert state_t4_cycle.plan_version == 4

    plan_v4 = db.query(Plan).filter_by(version=4).first()
    assert plan_v4 is not None
    assert plan_v4.status == "ACTIVE"

    db.close()
