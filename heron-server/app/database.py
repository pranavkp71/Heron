import psycopg2
import psycopg2.pool
import os
from contextlib import contextmanager
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

DATABASE_URL = os.getenv("DATABASE_URL")

# Pool is created lazily on first use — this prevents a cold-start DB
# connection failure from crashing the whole process at import time,
# which would make Railway return 502 on every request (including OPTIONS).
_pool = None


def _get_pool():
    global _pool
    if _pool is None:
        if not DATABASE_URL:
            raise RuntimeError("DATABASE_URL environment variable is not set")
        _pool = psycopg2.pool.ThreadedConnectionPool(1, 10, DATABASE_URL)
    return _pool


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
    pool = _get_pool()
    conn = pool.getconn()
    try:
        yield conn
    except Exception:
        conn.rollback()
        raise
    finally:
        pool.putconn(conn)


def get_connection():
    """
    Legacy helper — prefer db_connection() context manager for new code.
    Returns a connection from the pool; caller must call release_connection().
    """
    return _get_pool().getconn()


def release_connection(conn):
    """Return a connection obtained via get_connection() back to the pool."""
    _get_pool().putconn(conn)