import requests
import time

API_KEY = "heron83edc1af7668e803ab152ede97c679a8"

for i in range(5):
    payload = {
        "api_key": API_KEY,
        "events": [
            {
                "event_name": "payment.completed",
                "service": "api",
                "environment": "production",
                "timestamp": int(time.time())
            }
        ]
    }

    res = requests.post("http://localhost:8000/v1/events", json=payload)
    print(res.json())

    time.sleep(5)  # send every 10 sec



