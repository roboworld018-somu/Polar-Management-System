from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["Renewable Energy"])


class RenewableInput(BaseModel):
    solar_kw: float = 0
    wind_kw: float = 0
    battery_percent: float = 0


@router.post("/renewable/status")
def renewable_status(data: RenewableInput):
    total = data.solar_kw + data.wind_kw

    if total >= 40:
        status = "High renewable availability"
    elif total >= 20:
        status = "Moderate renewable availability"
    else:
        status = "Low renewable availability"

    return {
        "solar_kw": data.solar_kw,
        "wind_kw": data.wind_kw,
        "total_renewable_kw": round(total, 2),
        "battery_percent": data.battery_percent,
        "status": status,
    }
