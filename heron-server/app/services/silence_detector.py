import time
from app.database import get_connection
from app.services.slack_service import (
    send_slack_alert, 
    format_silence_alert
)
from app.services.incident_service import (
    create_incident, 
    resolve_incident
)


def detect_silence():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT 
            es.api_key, 
            es.event_name, 
            es.service, 
            es.environment, 
            es.last_seen, 
            es.avg_interval,
            es.incident_active,
            p.slack_webhook_url
        FROM event_stats es
        JOIN projects p ON es.api_key = p.api_key
        """
    )

    rows = cursor.fetchall()

    now = int(time.time())

    for row in rows:

        (
            api_key, 
            event_name, 
            service, 
            environment, 
            last_seen, 
            avg_interval, 
            incident_active,
            slack_webhook_url
        ) = row

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

            send_slack_alert(message, slack_webhook_url)

            create_incident(api_key, event_name, service, environment)

            cursor.execute(
                """
                UPDATE event_stats
                SET incident_active=TRUE
                WHERE api_key=%s AND event_name=%s AND service=%s AND environment=%s
                """,
                (api_key, event_name, service, environment)
            )

            conn.commit()
        
        elif gap <= threshold and incident_active:
            duration = resolve_incident(api_key, event_name, service, environment)
            print("INCIDENT RESOLVED")

            print(f"Event: {event_name}")
            print(f"Recovered after: {int(duration/60)} minutes")

            cursor.execute(
                """
                UPDATE event_stats
                SET incident_active=FALSE
                WHERE api_key=%s AND event_name=%s AND service=%s AND environment=%s
                """,
                (api_key, event_name, service, environment)
            )