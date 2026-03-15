import time
from app.database import get_connection


def detect_silence():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT api_key, event_name, service, environment, last_seen, avg_interval, incident_active
        FROM event_stats
        """
    )

    rows = cursor.fetchall()

    now = int(time.time())

    for row in rows:

        api_key, event_name, service, environment, last_seen, avg_interval, incident_active = row

        if avg_interval == 0:
            continue

        gap = now - last_seen

        threshold = max(avg_interval * 5, 60)

        if gap > threshold and not incident_active:

            print("SILENCE DETECTED")

            print(f"Event: {event_name}")
            print(f"Service: {service}")
            print(f"Environment: {environment}")
            print(f"Stopped for: {gap} seconds")

            cursor.execute(
                """
                UPDATE event_stats
                SET incident_active=TRUE
                WHERE api_key=%s AND event_name=%s AND service=%s AND environment=%s
                """,
                (api_key, event_name, service, environment)
            )

            conn.commit()