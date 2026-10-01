from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(tags=["Energy"])


class EnergyRecord(BaseModel):
    timestamp: str
    load_kw: float
    solar_kw: float = 0
    wind_kw: float = 0
    battery_percent: float = 0
    temperature_c: float = 0


@router.get("/energy/current")
def current_energy():
    return {
        "load_kw": 42.5,
        "solar_kw": 18.2,
        "wind_kw": 15.4,
        "battery_percent": 76,
        "temperature_c": -18,
        "fuel_consumption_lph": 3.2,
    }


@router.get("/energy/history")
def energy_history():
    return {
        "labels": ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
        "load": [41, 44, 46, 40, 43, 45],
        "solar": [0, 0, 8, 22, 17, 2],
        "wind": [14, 16, 13, 15, 18, 16],
    }


@router.post("/energy/records")
def add_records(records: List[EnergyRecord]):
    return {"message": "Records received", "count": len(records)}
