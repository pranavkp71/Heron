from app.database import db_connection
from app.utils.api_key import generate_api_key


def create_project(name: str, slack_webhook_url: str = None, user_id: int = None):
    api_key = generate_api_key()

    with db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO projects (name, api_key, slack_webhook_url, user_id)
            VALUES (%s, %s, %s, %s)
            RETURNING id, api_key
            """,
            (name, api_key, slack_webhook_url, user_id)
        )
        project = cursor.fetchone()
        conn.commit()

    return project