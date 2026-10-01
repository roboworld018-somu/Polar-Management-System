from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.energy import router as energy_router
from app.api.forecast import router as forecast_router
from app.api.renewable import router as renewable_router
from app.api.optimization import router as optimization_router

app = FastAPI(
    title="Polar Smart Energy Management API",
    description="API for AI-driven energy management at polar research stations.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(energy_router, prefix="/api")
app.include_router(forecast_router, prefix="/api")
app.include_router(renewable_router, prefix="/api")
app.include_router(optimization_router, prefix="/api")


@app.get("/")
def root():
    return {
        "project": "AI-Driven Smart Energy Management System",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}
