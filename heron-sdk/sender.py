import time
import threading
import requests
from .buffer import add_event, get_events
from .config import config

MAX_RETRIES = 3
RETRY_DELAY = 2   
SEND_INTERVAL = 5  


def send_events():
    while True:
        time.sleep(SEND_INTERVAL)
        events = get_events()

        if not events:
            continue  

        if config.debug:
            print(f"[Heron] Sending {len(events)} events...")

        success = _send_with_retry(events)

        if not success:
            if config.debug:
                print(f"[Heron] Failed to send {len(events)} events after {MAX_RETRIES} retries. Re-buffering.")
            for event in events:
                add_event(event)  
        else:
            if config.debug:
                print(f"[Heron] Successfully sent {len(events)} events.")


def _send_with_retry(events):
    """
    Attempt to send events to the Heron backend.
    Retries up to MAX_RETRIES times before giving up.
    Returns True if successful, False otherwise.
    """
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = requests.post(
                config.endpoint,
                json={
                    "api_key": config.api_key,
                    "events": events
                },
                timeout=3
            )

            if response.status_code == 200:
                return True
            else:
                if config.debug:
                    print(f"[Heron] Attempt {attempt}: Server returned {response.status_code}. Retrying...")

        except requests.exceptions.ConnectionError:
            if config.debug:
                print(f"[Heron] Attempt {attempt}: Connection failed. Retrying in {RETRY_DELAY}s...")
        except requests.exceptions.Timeout:
            if config.debug:
                print(f"[Heron] Attempt {attempt}: Request timed out. Retrying in {RETRY_DELAY}s...")
        except Exception as e:
            if config.debug:
                print(f"[Heron] Attempt {attempt}: Unexpected error: {e}")

        if attempt < MAX_RETRIES:
            time.sleep(RETRY_DELAY)

    return False


def start_sender():
    thread = threading.Thread(target=send_events, daemon=True)
    thread.start()

    if config.debug:
        print("[Heron] Background sender started.")