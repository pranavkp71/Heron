import time
from app.database import get_connection


def purge_old_events(max_age_hours: int = 24):
    """Delete raw events older than max_age_hours. Keeps the events table lightweight."""

    cutoff = int(time.time()) - (max_age_hours * 3600)

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "DELETE FROM events WHERE timestamp < %s",
            (cutoff,)
        )
        deleted = cursor.rowcount
        conn.commit()
        if deleted:
            print(f"[cleanup] Purged {deleted} raw event(s) older than {max_age_hours}h")
    except Exception as e:
        conn.rollback()
        raise e
