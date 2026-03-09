import threading

events_buffer = []
buffer_lock = threading.Lock()

def add_event(event):
    with buffer_lock:
        events_buffer.append(event)

def get_events():
    global events_buffer

    with buffer_lock:
        events = events_buffer
        events_buffer = []
    return events