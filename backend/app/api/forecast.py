from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["AI Forecasting"])


class ForecastRequest(BaseModel):
    hours: int = 24
    temperature_c: float = -18
    solar_kw: float = 15
    wind_kw: float = 12


@router.post("/forecast/load")
def forecast_load(request: ForecastRequest):
    base_load = 40.0
    results = []

    for hour in range(request.hours):
        cold_factor = max(0, (-request.temperature_c - 10) * 0.15)
        renewable_factor = max(0, (request.solar_kw + request.wind_kw) * 0.03)
        predicted = base_load + cold_factor - renewable_factor + (hour % 5) * 0.8
        results.append({
            "hour": hour + 1,
            "predicted_load_kw": round(predicted, 2)
        })

    return {"forecast_hours": request.hours, "forecast": results}
