from heron import init, track
import time

init(
    api_key="test_key",
    service="api",
    debug=True
)

while True:
    track("login_evnet", user_id=3)
    time.sleep(1)







