from heron import init, track
import time

init(
    api_key="test_key",
    service="api",
    debug=True
)

while True:
    track("test.event", user_id=1)
    time.sleep(1)