from app.database import db_connection
from psycopg2.extras import Json
from app.services.event_stats_service import update_event_stats


def store_events(api_key, events):
    with db_connection() as conn:
        cursor = conn.cursor()
        for event in events:
            cursor.execute(
                """
                INSERT INTO events
                (api_key, event_name, service, environment, metadata, timestamp)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    api_key,
                    event["event_name"],
                    event.get("service"),
                    event.get("environment"),
                    Json(event.get("metadata", {})),
                    event["timestamp"]
                )
            )
            update_event_stats(api_key, event)

        conn.commit()