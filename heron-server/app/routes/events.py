from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from app.services.event_service import store_events
from app.database import db_connection
from app.dependencies import get_current_user

router = APIRouter()


@router.post("/v1/events")
async def receive_events(payload: dict):
    api_key = payload.get("api_key")

    project = validate_api_key(api_key)
    if not project:
        return {"error": "Invalid API key"}

    events = payload.get("events", [])

    for ev in events:
        ev["environment"] = normalize_environment(ev.get("environment"))

    store_events(api_key, events)

    return {
        "status": "stored",
        "count": len(events)
    }


def normalize_environment(env: str) -> str:
    if not env:
        return "development"

    env = env.strip().lower()
    if env in ("prod", "production"):
        return "production"
    if env in ("stage", "staging", "stg"):
        return "staging"
    if env in ("development", "developement", "dev", "test"):
        return "development"

    return "development"


def validate_api_key(api_key):
    with db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id FROM projects WHERE api_key=%s",
            (api_key,)
        )
        return cursor.fetchone()


class TestEventRequest(BaseModel):
    event_name: str


@router.post("/v1/events/test")
async def test_event(payload: TestEventRequest, current_user: dict = Depends(get_current_user)):
    with db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT api_key FROM projects WHERE user_id=%s LIMIT 1", (current_user["id"],))
        row = cursor.fetchone()

    if not row:
        return {"error": "Project not found"}

    api_key = row[0]

    event_data = {
        "event_name": payload.event_name,
        "timestamp": int(datetime.utcnow().timestamp()),
        "service": "api",
        "environment": "development",
        "metadata": {"test_event": True}
    }

    store_events(api_key, [event_data])
    return {"status": "stored", "event_name": payload.event_name}