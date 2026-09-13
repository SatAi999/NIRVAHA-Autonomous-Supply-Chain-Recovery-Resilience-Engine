from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import engine, Base
from backend.seed.seed_data import init_db, seed_database, SessionLocal
from backend.api.routes import router as api_router
from backend.api.sse import sse_router

# Initialize Database Schema
init_db()
db = SessionLocal()
seed_database(db)
db.close()

app = FastAPI(
    title=settings.APP_NAME,
    description="Autonomous Supply Chain Recovery & Resilience Engine (Tech Zephyr 4.0, IIT Bhubaneswar)",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(sse_router)

@app.get("/")
def read_root():
    return {
        "status": "ONLINE",
        "system": settings.APP_NAME,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
