from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from core.database import connect_to_mongo, close_mongo_connection
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

from api import upload_routes, report_routes, dashboard_routes, chat_routes

# Load env variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="IQLenz - AI Business Intelligence Platform",
    description="Agentic AI platform for automated business reports and document insights.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], # Common Vite and CRA ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "IQLenz API is running."}

# Register the routers
app.include_router(upload_routes.router, prefix="/api")
app.include_router(report_routes.router, prefix="/api")
app.include_router(dashboard_routes.router, prefix="/api")
app.include_router(chat_routes.router, prefix="/api")
