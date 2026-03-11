import psycopg2

conn = psycopg2.connect(
    dbname = "heron",
    user = "pranav",
    password = "pranav@6321",
    host = "localhost"
)

def get_connection():
    return conn