from fastapi import APIRouter
from app.services.incident_service import (
    get_all_incidents,
    get_active_incidents
)

router = APIRouter()


@router.get("/v1/incidents")
def fetch_incidents(api_key: str):
    return {
        "incidents": get_all_incidents(api_key)
    }


@router.get("/v1/incidents/active")
def fetch_active_incidents(api_key: str):
    return {
        "incidents": get_active_incidents(api_key)
    }