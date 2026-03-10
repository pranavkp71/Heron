from fastapi import FastAPI
from datetime import datetime

app = FastAPI()


@app.post("/v1/events")
async def receive_events(payload: dict):
    print("\n📥 Events received at", datetime.utcnow())
    print(payload)

    return {
        "status": "ok",
        "received_events": len(payload.get("events", []))
    }