import os

class HeronConfig:
    api_key = None
    endpoint = "http://127.0.0.1:8000/v1/events"
    environment = "production"
    service = "app"
    debug = False

config = HeronConfig()

def init(api_key: str, environment: str = "production", service="app", debug=False):
    config.api_key = api_key
    config.environment = environment
    config.service = service
    config.debug = debug

    from .sender import start_sender

    start_sender()
    