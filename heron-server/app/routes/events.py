from fastapi import APIRouter
from app.services.event_service import store_events

router = APIRouter()

@router.post("/v1/events")
async def receive_events(payload: dict):

    api_key = payload.get("api_key")
    events = payload.get("events", [])

    store_events(api_key, events)

    return {
        "status": "stored",
        "count": len(events)
    }