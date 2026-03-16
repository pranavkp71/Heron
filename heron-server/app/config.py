import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL')