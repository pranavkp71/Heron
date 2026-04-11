import requests
import time

API_KEY = "heron13f5a2274b71521955ccd8bea1099c33"

for i in range(20):
    payload = {
        "api_key": API_KEY,
        "events": [
            {
                "event_name": "data.event",
                "service": "api",
                "environment": "development",
                "timestamp": int(time.time())
            }
        ]
    }

    res = requests.post("http://localhost:8000/v1/events", json=payload)
    print(res.json())

    time.sleep(5)



