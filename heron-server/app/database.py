import psycopg2
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

DATABASE_URL = os.getenv("DATABASE_URL")

# Use the DATABASE_URL directly for connection
conn = psycopg2.connect(DATABASE_URL)

def get_connection():
    return conn