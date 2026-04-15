import time
from app.services.silence_detector import detect_silence
from app.services.cleanup_service import purge_old_events

PURGE_INTERVAL_TICKS = 12  # run purge every 12 × 5 s = 60 s


def run_worker():
    tick = 0
    while True:
        detect_silence()

        tick += 1
        if tick >= PURGE_INTERVAL_TICKS:
            purge_old_events(max_age_hours=24)
            tick = 0

        time.sleep(5)