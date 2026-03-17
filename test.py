import requests
import time

API_KEY = "heron584d1a097626d8c75804ba7943549736"

for i in range(5):
    payload = {
        "api_key": API_KEY,
        "events": [
            {
                "event_name": "login.completed",
                "service": "api",
                "environment": "production",
                "timestamp": int(time.time())
            }
        ]
    }

    res = requests.post("http://localhost:8000/v1/events", json=payload)
    print(res.json())

    time.sleep(5)



