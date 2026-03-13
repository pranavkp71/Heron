import time
from app.services.silence_detector import detect_silence


def run_worker():
    while True:
        detect_silence()
        time.sleep(60)