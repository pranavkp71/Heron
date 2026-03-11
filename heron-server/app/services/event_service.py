from app.database import get_connection
from psycopg2.extras import Json

def store_events(api_key, events):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        for event in events:
            cursor.execute(
                """
                INSERT INTO events
                (api_key, event_name, service, environment, metadata, timestamp)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    api_key,
                    event["event"],
                    event.get("service"),
                    event.get("environment"),
                    Json(event.get("metadata", {})),
                    event["timestamp"]
                )
            )  
        
        conn.commit()
    
    except Exception as e:

        conn.rollback()
        raise e