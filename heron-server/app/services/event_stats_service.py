from app.database import get_connection


def update_event_stats(api_key, event):

    conn = get_connection()
    cursor = conn.cursor()

    event_name = event["event"]
    service = event.get("service")
    environment = event.get("environment")
    timestamp = event["timestamp"]

    cursor.execute(
        """
        SELECT last_seen, avg_interval, event_count
        FROM event_stats
        WHERE api_key=%s AND event_name=%s AND service=%s AND environment=%s
        """,
        (api_key, event_name, service, environment)
    )

    row = cursor.fetchone()

    if row:

        last_seen, avg_interval, count = row

        interval = timestamp - last_seen

        new_avg = ((avg_interval or 0) * count + interval) / (count + 1)

        cursor.execute(
            """
            UPDATE event_stats
            SET last_seen=%s, avg_interval=%s, event_count=%s, incident_active=FALSE
            WHERE api_key=%s AND event_name=%s AND service=%s AND environment=%s
            """,
            (timestamp, new_avg, count + 1, api_key, event_name, service, environment)
        )

    else:

        cursor.execute(
            """
            INSERT INTO event_stats
            (api_key, event_name, service, environment, last_seen, avg_interval, event_count)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
            """,
            (api_key, event_name, service, environment, timestamp, 0, 1)
        )

    conn.commit()