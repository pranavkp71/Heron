from app.database import get_connection
from datetime import datetime


def create_incident(api_key, event_name, service, environment):
    conn = get_connection()
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
    conn = get_connection()
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