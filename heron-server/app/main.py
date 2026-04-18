from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from app.routes.events import router as event_router
from app.routes.auth import router as auth_router
import threading
import os
from app.worker import run_worker
from app.routes import projects
from app.routes import incidents

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://heron-rose.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{full_path:path}")
def preflight_handler(request: Request, full_path: str):
    return Response(status_code=200)


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
