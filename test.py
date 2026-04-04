import requests
import time

API_KEY = "heronc829226824aa333f2587b59ea1991ce9"

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



