from heron import init, track
import time

init(
    api_key="test_key",
    service="api",
    debug=True
)

while True:
    track("signup_event", user_id=2)
    time.sleep(1)







