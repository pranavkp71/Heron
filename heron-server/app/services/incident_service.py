from app.database import db_connection
from datetime import datetime, timezone


def create_incident(api_key, event_name, service, environment):
    with db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO incidents (
                api_key, event_name, service, environment, started_at
            )
            VALUES (%s,%s,%s,%s,%s)
            """,
            (api_key, event_name, service, environment, datetime.utcnow())
        )
        conn.commit()


def resolve_incident(api_key, event_name, service, environment):
    with db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, started_at FROM incidents
            WHERE api_key=%s
            AND event_name=%s
            AND service=%s
            AND environment=%s
            AND resolved_at IS NULL
            ORDER BY started_at DESC
            LIMIT 1
            """,
            (api_key, event_name, service, environment)
        )
        incident = cursor.fetchone()

        if not incident:
            return None

        incident_id, started_at = incident
        now = datetime.utcnow()
        duration = int((now - started_at).total_seconds())

        cursor.execute(
            """
            UPDATE incidents
            SET resolved_at=%s, duration=%s
            WHERE id=%s
            """,
            (now, duration, incident_id)
        )
        conn.commit()

    return duration


def get_all_incidents(user_id: int, environment: str = None):
    with db_connection() as conn:
        cursor = conn.cursor()
        if environment:
            cursor.execute(
                """
                SELECT i.event_name, i.service, i.environment, i.started_at, i.resolved_at, i.duration
                FROM incidents i
                JOIN projects p ON i.api_key = p.api_key
                WHERE p.user_id = %s AND i.environment = %s
                ORDER BY i.started_at DESC
                """,
                (user_id, environment)
            )
        else:
            cursor.execute(
                """
                SELECT i.event_name, i.service, i.environment, i.started_at, i.resolved_at, i.duration
                FROM incidents i
                JOIN projects p ON i.api_key = p.api_key
                WHERE p.user_id = %s
                ORDER BY i.started_at DESC
                """,
                (user_id,)
            )
        rows = cursor.fetchall()

    return [
        {
            "event_name": row[0],
            "service": row[1],
            "environment": row[2],
            "started_at": row[3].replace(tzinfo=timezone.utc) if row[3] else None,
            "resolved_at": row[4].replace(tzinfo=timezone.utc) if row[4] else None,
            "duration": row[5],
        }
        for row in rows
    ]


def get_active_incidents(user_id: int, environment: str = None):
    with db_connection() as conn:
        cursor = conn.cursor()
        if environment:
            cursor.execute(
                """
                SELECT i.event_name, i.service, i.environment, i.started_at
                FROM incidents i
                JOIN projects p ON i.api_key = p.api_key
                WHERE p.user_id = %s AND i.resolved_at IS NULL AND i.environment = %s
                ORDER BY i.started_at DESC
                """,
                (user_id, environment)
            )
        else:
            cursor.execute(
                """
                SELECT i.event_name, i.service, i.environment, i.started_at
                FROM incidents i
                JOIN projects p ON i.api_key = p.api_key
                WHERE p.user_id = %s AND i.resolved_at IS NULL
                ORDER BY i.started_at DESC
                """,
                (user_id,)
            )
        rows = cursor.fetchall()

    return [
        {
            "event_name": row[0],
            "service": row[1],
            "environment": row[2],
            "started_at": row[3].replace(tzinfo=timezone.utc) if row[3] else None,
        }
        for row in rows
    ]