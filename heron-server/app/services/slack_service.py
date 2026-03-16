import requests
from app.config import SLACK_WEBHOOK_URL
from datetime import datetime


def send_slack_alert(message: str):
    if not SLACK_WEBHOOK_URL:
        return
    
    payload = {
        "text": message
    }

    try:
        requests.post(SLACK_WEBHOOK_URL, json=payload, timeout=5)
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

    last_seen = datetime.fromtimestamp(last_seen)
    
    return f"""
🚨 *Heron Alert*

Event: `{event_name}`
Service: `{service}`
Environment: `{environment}`

Last_seen: {gap_minutes} minutes ago
Excepted interval: ~{avg_interval} seconds

"""