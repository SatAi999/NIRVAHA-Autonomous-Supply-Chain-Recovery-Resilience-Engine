import asyncio
import json
from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
from backend.events import event_bus

sse_router = APIRouter()

@sse_router.get("/api/events")
async def event_stream(request: Request):
    """
    Server-Sent Events endpoint streaming realtime network state changes and agent activity.
    """
    async def event_generator():
        q = event_bus.subscribe()
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    event = await asyncio.wait_for(q.get(), timeout=15.0)
                    yield event
                except asyncio.TimeoutError:
                    yield {
                        "event": "heartbeat",
                        "data": json.dumps({"status": "CONNECTED", "system": "NIRVAHA Digital Twin"})
                    }
        finally:
            event_bus.unsubscribe(q)

    return EventSourceResponse(event_generator())

