import requests
import time

API_KEY = "heron65da535e2e99de426ae7628b26b04285"

for i in range(5):
    payload = {
        "api_key": API_KEY,
        "events": [
            {
                "event_name": "lockup.event",
                "service": "api",
                "environment": "production",
                "timestamp": int(time.time())
            }
        ]
    }

    res = requests.post("http://localhost:8000/v1/events", json=payload)
    print(res.json())

    time.sleep(10)



