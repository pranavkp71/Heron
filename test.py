import requests
import time

API_KEY = "heronaab484777882db7e164e10901f01bbf4"

for i in range(20):
    payload = {
        "api_key": API_KEY,
        "events": [
            {
                "event_name": "payment.event",
                "service": "api",
                "environment": "production",
                "timestamp": int(time.time())
            }
        ]
    }

    res = requests.post("https://heron-production.up.railway.app/v1/events", json=payload)
    print(res.json())

    time.sleep(5)



