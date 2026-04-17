import os

class HeronConfig:
    api_key = None
    endpoint = os.getenv("HERON_ENDPOINT", "https://heron-production.up.railway.app/v1/events")
    environment = "production"
    service = "app"
    debug = False


config = HeronConfig()


def init(
    api_key: str,
    endpoint: str = os.getenv("HERON_ENDPOINT", "https://heron-production.up.railway.app/v1/events"),
    environment: str = os.getenv("HERON_ENVIRONMENT", "production"),
    service: str = os.getenv("HERON_SERVICE", "app"),
    debug: bool = False
):
    """
    Initialize the Heron SDK.

    Call this once at startup, before tracking any events.

    Args:
        api_key:     Your Heron project API key
        endpoint:    Heron backend URL
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