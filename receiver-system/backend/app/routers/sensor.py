from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from pathlib import Path
import json

router = APIRouter()

# Folder to save sensor readings (JSON files)
SENSOR_DATA_DIR = Path("storage/sensor_data")
SENSOR_DATA_DIR.mkdir(parents=True, exist_ok=True)

class VibrationData(BaseModel):
    equipment_id: str
    vibration_value: float
    timestamp: datetime = None

@router.post("/vibration")
async def receive_vibration_data(data: VibrationData):
    try:
        if not data.timestamp:
            data.timestamp = datetime.timezone.utc()

        filename = f"{data.equipment_id}_{data.timestamp.strftime('%Y%m%dT%H%M%S')}.json"
        file_path = SENSOR_DATA_DIR / filename

        # Save the data as JSON file
        with file_path.open("w") as f:
            json.dump(data.dict(), f, default=str)

        return {"message": "Vibration data received successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
