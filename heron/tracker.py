import time
from .buffer import add_event
from .config import config

def track(event_name: str, **metadata):
    if not config.api_key:
        return 
    
    event = {
        "event": event_name,
        "timestamp": int(time.time()),
        "service": config.service,
        "environment": config.environment,
        "metadata": metadata
    }

    add_event(event)