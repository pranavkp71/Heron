import threading

MAX_BUFFER_SIZE = 1000  

events_buffer = []
buffer_lock = threading.Lock()


def add_event(event):
    with buffer_lock:
        if len(events_buffer) >= MAX_BUFFER_SIZE:
            events_buffer.pop(0)
        events_buffer.append(event)


def get_events():
    global events_buffer

    with buffer_lock:
        events = events_buffer.copy()
        events_buffer = []

    return events


def buffer_size():
    with buffer_lock:
        return len(events_buffer)