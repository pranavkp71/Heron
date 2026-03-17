from fastapi import APIRouter
from app.services.event_service import store_events
from app.database import get_connection

router = APIRouter()

@router.post("/v1/events")
async def receive_events(payload: dict):

    project = validate_api_key(payload["api_key"])

    if not project:
        return {"error": "Invalid API key"}

    api_key = payload.get("api_key")
    events = payload.get("events", [])

    store_events(api_key, events)

    return {
        "status": "stored",
        "count": len(events)
    }

def validate_api_key(api_key):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM projects WHERE api_key=%s",
        (api_key,)
    )

    return cursor.fetchone()