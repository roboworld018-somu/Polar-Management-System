from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["Energy Optimization"])


class OptimizationRequest(BaseModel):
    load_kw: float
    solar_kw: float = 0
    wind_kw: float = 0
    battery_percent: float = 0
    temperature_c: float = -18


@router.post("/optimization/recommend")
def optimization_recommend(data: OptimizationRequest):
    renewable = data.solar_kw + data.wind_kw
    deficit = data.load_kw - renewable

    if renewable >= data.load_kw:
        action = "Use renewable energy and charge battery"
        backup = 0
        battery_action = "CHARGE"
    elif data.battery_percent >= 30 and deficit <= data.load_kw * 0.5:
        action = "Use renewable energy + battery"
        backup = 0
        battery_action = "DISCHARGE"
    else:
        action = "Use renewable energy + backup generator"
        backup = round(max(deficit, 0), 2)
        battery_action = "RESERVE"

    return {
        "recommended_action": action,
        "renewable_generation_kw": round(renewable, 2),
        "backup_power_kw": backup,
        "battery_action": battery_action,
        "estimated_load_kw": data.load_kw,
    }
