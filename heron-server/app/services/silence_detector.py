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
        api_key, even_name, service, environment, last_seen, avg_interval = row
        
        if avg_interval == 0:
            continue

        gap = now - last_seen

        threshold = avg_interval * 5

        if gap > threshold:
            print("SILENCE DETECTED")
            print(even_name, "stopped for", gap, "seconds")
