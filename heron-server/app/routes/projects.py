from fastapi import APIRouter
from app.services.project_service import create_project

router = APIRouter()

@router.post("/v1/projects")
def create_new_project(name: str):
    project = create_project(name)

    return {
        "project_id": project[0],
        "api_key": project[1]
    }