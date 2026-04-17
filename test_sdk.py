import heron
import time

print("Initializing Heron SDK...")
heron.init(api_key="test_api_key", environment="production", debug=True)

print("Tracking event...")
heron.track("payment.completed", amount=500, user_id=42)

print("Event tracked into buffer. Waiting to see if sender wakes up... (Ctrl+C to abort)")
try:
    time.sleep(6)
except KeyboardInterrupt:
    pass
print("Finished!")
