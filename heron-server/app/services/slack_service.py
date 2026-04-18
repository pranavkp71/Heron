import requests
from app.config import SLACK_WEBHOOK_URL
from datetime import datetime



def send_slack_alert(message: str, webhook_url: str):

    if not webhook_url:
        print("No webhook for project")
        return
    
    payload = {
        "text": message
    }

    try:
        response = requests.post(webhook_url, json=payload, timeout=5)
        print("Slack status:", response.status_code)
    except Exception as e:
        print("Slack alert failed:", e)

def format_silence_alert(
        event_name,
        service,
        environment,
        gap_seconds,
        avg_interval,
        last_seen
):
    
    gap_minutes = int(gap_seconds / 60)
    excepted_minutes = max(int(avg_interval / 60), 1)

    last_seen_time = datetime.fromtimestamp(last_seen)
    
    return f"""
🚨 *Heron Alert*

*Event:* `{event_name}`
*Service:* `{service}`
*Environment:* `{environment}`

*Last_seen:* {last_seen_time}
*Expected interval:* ~{excepted_minutes} minutes
*Silence detected for:* {gap_minutes} minutes

"""

def format_recovery_alert(event_name, duration):

    minutes = int(duration / 60)

    return f"""
✅ *Heron Recovery*

*Event:* `{event_name}`

*Events resumed.*

*Downtime:* {minutes} minutes

"""
