from fastapi import APIRouter, Depends
from app.services.project_service import create_project
from app.dependencies import get_current_user

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