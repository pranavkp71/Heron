from fastapi import FastAPI
from app.routes.events import router as event_router
from app.routes.auth import router as auth_router
import threading
from app.worker import run_worker
from app.routes import projects
from app.routes import incidents

app = FastAPI()

app.include_router(auth_router)
app.include_router(event_router)
app.include_router(projects.router)
app.include_router(incidents.router)

@app.get("/")
def root():
    return {"message": "Heron API running"}

@app.on_event('startup')
def start_worker():
    thread = threading.Thread(target=run_worker, daemon=True)
    thread.start()
