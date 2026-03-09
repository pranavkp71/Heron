import os

class HeronConfig:
    api_key = None
    endpoint = "https://api.heron.dev/v1/events"
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
    