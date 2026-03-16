import time
from app.database import get_connection
from app.services.slack_service import (
    send_slack_alert, 
    format_silence_alert
)


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

            message = format_silence_alert(
                event_name=event_name,
                service=service,
                environment=environment,
                gap_seconds=gap,
                avg_interval=avg_interval,
                last_seen=last_seen

            )
            print(message)

            send_slack_alert(message)


            cursor.execute(
                """
                UPDATE event_stats
                SET incident_active=TRUE
                WHERE api_key=%s AND event_name=%s AND service=%s AND environment=%s
                """,
                (api_key, event_name, service, environment)
            )

            conn.commit()