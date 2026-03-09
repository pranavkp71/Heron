import time
import threading
import requests
from .buffer import get_events
from .config import config

def send_events():
    while True:
        events = get_events()

        if events:
            try:
                requests.post(
                    config.endpoint,
                    json={
                        "api_key": config.api_key,
                        "events": events
                    },
                    timeout=2
                )
            except Exception:
                pass
        
        if config.debug:
            print("sending events:", events)
        
        time.sleep(5)

def start_sender():
    thread = threading.Thread(target=send_events, daemon=True)
    thread.start()
