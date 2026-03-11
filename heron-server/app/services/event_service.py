from app.database import get_connection

def store_events(api_key, events):

    conn = get_connection()
    cursor = conn.cursor()

    for event in events:
        cursor.execute(
            """
            INSERT INTO events
            (api_key, events_name, service, environment, metadata, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s,)
            """,
            (
                api_key,
                event["event"],
                event.get("service"),
                event.get("environment"),
                event.get("metadata"),
                event["timestamp"]
            )
        )  
    
    conn.commit()