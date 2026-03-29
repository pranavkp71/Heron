from fastapi import APIRouter, Depends
from app.services.project_service import create_project
from app.dependencies import get_current_user
from app.database import get_connection

router = APIRouter()

@router.post("/v1/projects")
def create_new_project(
    name: str,
    slack_webhook_url: str = None,
    current_user: dict = Depends(get_current_user)
):
    project = create_project(name, slack_webhook_url, user_id=current_user["id"])

    return {
        "project_id": project[0],
        "api_key": project[1]
    }

@router.post("/v1/projects/webhook")
def update_webhook(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    webhook_url = data.get("webhook_url")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE projects
        SET slack_webhook_url=%s
        WHERE user_id=%s
        """,
        (webhook_url, current_user["id"])
    )

    conn.commit()

    return {"message": "Webhook updated successfully"}