import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL')

JWT_SECRET = os.getenv('JWT_SECRET', 'change-me-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRE_HOURS = 24