from fastapi import APIRouter
from app.services.incident_service import (
    get_all_incidents,
    get_active_incidents
)
from app.database import get_connection

router = APIRouter()


@router.get("/v1/incidents")
def fetch_incidents(api_key: str):
    return {
        "incidents": get_all_incidents(api_key)
    }


@router.get("/v1/incidents/active")
def fetch_active_incidents(api_key: str):
    return {
        "incidents": get_active_incidents(api_key)
    }


@router.get("/v1/stats")
def fetch_stats(api_key: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM events WHERE api_key=%s", (api_key,))
    total_events = cursor.fetchone()[0]

    cursor.execute(
        "SELECT AVG(duration) FROM incidents WHERE api_key=%s AND resolved_at IS NOT NULL",
        (api_key,)
    )
    avg_duration_seconds = cursor.fetchone()[0]
    avg_minutes = round(avg_duration_seconds / 60, 1) if avg_duration_seconds else None

    return {
        "total_events": total_events,
        "avg_resolution_minutes": avg_minutes,
    }