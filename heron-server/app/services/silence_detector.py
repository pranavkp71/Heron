import time
from app.database import get_connection


def detect_silence():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT api_key, event_name, service, environment, last_seen, avg_interval
        FROM event_stats
        """
    )

    rows = cursor.fetchall()

    now = int(time.time())

    for row in rows:

        api_key, event_name, service, environment, last_seen, avg_interval = row

        if avg_interval == 0:
            continue

        gap = now - last_seen

        threshold = max(avg_interval * 5, 60)

        if gap > threshold:

            print("SILENCE DETECTED")

            print(f"Event: {event_name}")
            print(f"Service: {service}")
            print(f"Environment: {environment}")
            print(f"Stopped for: {gap} seconds")