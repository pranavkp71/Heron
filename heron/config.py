class HeronConfig:
    api_key = None
    endpoint = "http://127.0.0.1:8000/v1/events"
    environment = "production"
    service = "app"
    debug = False


config = HeronConfig()


def init(
    api_key: str,
    endpoint: str = "http://127.0.0.1:8000/v1/events",
    environment: str = "production",
    service: str = "app",
    debug: bool = False
):
    """
    Initialize the Heron SDK.

    Call this once at startup, before tracking any events.

    Args:
        api_key:     Your Heron project API key
        endpoint:    Heron backend URL (default: localhost for development)
        environment: 'production', 'staging', or 'development'
        service:     Name of this service (e.g. 'api', 'worker', 'payments')
        debug:       Print SDK activity to console if True
    
    Usage:
        import heron
        heron.init(api_key="your_key", service="api", environment="production")
    """
    config.api_key = api_key
    config.endpoint = endpoint
    config.environment = environment
    config.service = service
    config.debug = debug

    from .sender import start_sender
    start_sender()