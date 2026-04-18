import psycopg2
import psycopg2.pool
import os
from contextlib import contextmanager
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

DATABASE_URL = os.getenv("DATABASE_URL")

# Thread-safe connection pool — safe for FastAPI + background worker threads.
# min=1 keeps a warm connection alive; max=10 handles concurrent requests.
_pool = psycopg2.pool.ThreadedConnectionPool(1, 10, DATABASE_URL)


@contextmanager
def db_connection():
    """
    Context manager that checks out a connection from the pool,
    rolls back on any exception, and always returns it to the pool.

    Usage:
        with db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(...)
            conn.commit()
    """
    conn = _pool.getconn()
    try:
        yield conn
    except Exception:
        conn.rollback()
        raise
    finally:
        _pool.putconn(conn)


def get_connection():
    """
    Legacy helper kept for backward compatibility.
    Prefer db_connection() context manager for new code.
    Returns a connection from the pool — caller is responsible for
    calling release_connection() when done.
    """
    return _pool.getconn()


def release_connection(conn):
    """Return a connection obtained via get_connection() back to the pool."""
    _pool.putconn(conn)