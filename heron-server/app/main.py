from  fastapi import FastAPI
from app.routes.events import router as event_router

app = FastAPI()

app.include_router(event_router)

@app.get("/")
def root():
    return {"message": "Heron API running"}