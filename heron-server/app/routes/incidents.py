from fastapi import APIRouter, Depends
from typing import Optional
from app.services.incident_service import (
    get_all_incidents,
    get_active_incidents
)
from app.database import db_connection
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/v1/incidents")
def fetch_incidents(environment: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    return {
        "incidents": get_all_incidents(current_user["id"], environment)
    }


@router.get("/v1/incidents/active")
def fetch_active_incidents(environment: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    return {
        "incidents": get_active_incidents(current_user["id"], environment)
    }


@router.get("/v1/stats")
def fetch_stats(environment: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    with db_connection() as conn:
        cursor = conn.cursor()

        if environment:
            cursor.execute(
                """
                SELECT COALESCE(SUM(es.event_count), 0)
                FROM event_stats es
                JOIN projects p ON es.api_key = p.api_key
                WHERE p.user_id = %s AND es.environment = %s
                """,
                (current_user["id"], environment)
            )
        else:
            cursor.execute(
                """
                SELECT COALESCE(SUM(es.event_count), 0)
                FROM event_stats es
                JOIN projects p ON es.api_key = p.api_key
                WHERE p.user_id = %s
                """,
                (current_user["id"],)
            )
        total_events = cursor.fetchone()[0]

        if environment:
            cursor.execute(
                """
                SELECT AVG(i.duration)
                FROM incidents i
                JOIN projects p ON i.api_key = p.api_key
                WHERE p.user_id = %s AND i.resolved_at IS NOT NULL AND i.environment = %s
                """,
                (current_user["id"], environment)
            )
        else:
            cursor.execute(
                """
                SELECT AVG(i.duration)
                FROM incidents i
                JOIN projects p ON i.api_key = p.api_key
                WHERE p.user_id = %s AND i.resolved_at IS NOT NULL
                """,
                (current_user["id"],)
            )
        avg_duration_seconds = cursor.fetchone()[0]

    avg_minutes = round(avg_duration_seconds / 60, 1) if avg_duration_seconds else None

    return {
        "total_events": total_events,
        "avg_resolution_minutes": avg_minutes,
    }