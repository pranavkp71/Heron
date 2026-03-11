import psycopg2

conn = psycopg2.connect(
    dbname = "heron",
    user = "postgres",
    password = "password",
    host = "localhost"
)

def get_connection():
    return conn