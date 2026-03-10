import time
from .buffer import add_event
from .config import config


def track(event_name: str, **metadata):
    """
    Track a business event.

    Usage:
        track("user.signup", user_id=123, plan="pro")
        track("payment.failed", user_id=123, amount=49.99)
    """
    if not config.api_key:
        if config.debug:
            print("[Heron] Warning: api_key not set. Call heron.init() first.")
        return

    event = {
        "event": event_name,
        "timestamp": int(time.time()),
        "service": config.service,
        "environment": config.environment,
        "metadata": metadata
    }

    add_event(event)

    if config.debug:
        print(f"[Heron] Tracked: {event_name} | metadata: {metadata}")