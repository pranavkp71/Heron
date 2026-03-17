from app.database import get_connection
from app.utils.api_key import generate_api_key


def create_project(name: str, slack_webhook_url: str = None):
    
    conn = get_connection()
    cursor = conn.cursor()

    api_key = generate_api_key()

    cursor.execute(
        """
        INSERT INTO projects (name, api_key, slack_webhook_url)
        VALUES (%s, %s, %s)
        RETURNING id, api_key
        """,
        (name, api_key, slack_webhook_url)
    )

    project = cursor.fetchone()
    conn.commit()

    return project