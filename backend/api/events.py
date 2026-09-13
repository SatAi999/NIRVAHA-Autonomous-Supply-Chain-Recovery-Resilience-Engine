import asyncio
import json
import datetime
from sqlalchemy.orm import Session
from backend.models.domain import SystemState, Plan, AuditLog

class EventBus:
    def __init__(self):
        self._listeners = set()

    def subscribe(self):
        q = asyncio.Queue()
        self._listeners.add(q)
        return q

    def unsubscribe(self, q):
        self._listeners.discard(q)

    def publish_sync(self, event_type: str, data: dict):
        """
        Synchronous publish wrapper for thread-safe or loop event broadcasting.
        """
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(self.publish(event_type, data))
        except RuntimeError:
            pass

    async def publish(self, event_type: str, data: dict):
        event_payload = {
            "event": event_type,
            "data": json.dumps(data)
        }
        for listener in list(self._listeners):
            try:
                await listener.put(event_payload)
            except Exception:
                pass

event_bus = EventBus()

def get_current_env_version(db: Session) -> int:
    state = db.query(SystemState).first()
    if not state:
        state = SystemState(id=1, environment_version=1, last_updated=datetime.datetime.utcnow())
        db.add(state)
        db.commit()
        db.refresh(state)
    return state.environment_version

def increment_env_version(db: Session, reason: str = "State mutation") -> int:
    state = db.query(SystemState).first()
    if not state:
        state = SystemState(id=1, environment_version=1, last_updated=datetime.datetime.utcnow())
        db.add(state)
    
    state.environment_version += 1
    state.last_updated = datetime.datetime.utcnow()

    # Invalidate previous active plans created at an earlier version
    active_plans = db.query(Plan).filter_by(status="ACTIVE").all()
    for p in active_plans:
        if getattr(p, "created_at_env_version", 1) < state.environment_version:
            p.status = "INVALIDATED"
            p.invalidation_reason = f"Plan invalidated by downstream state mutation at env_version {state.environment_version} ({reason})"

    db.add(AuditLog(
        action_name="ENV_VERSION_INCREMENTED",
        payload={"new_version": state.environment_version, "reason": reason}
    ))

    db.commit()

    event_bus.publish_sync("ENV_VERSION_UPDATED", {
        "environment_version": state.environment_version,
        "reason": reason
    })

    return state.environment_version
