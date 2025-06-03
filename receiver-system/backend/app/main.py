from fastapi import FastAPI
from app.routers import video, sensor
from app.routers import video  # make sure to have __init__.py files in the folders

app = FastAPI(title="Industrial Equipment Health Monitor Receiver")

app.include_router(video.router, prefix="/video", tags=["Video"])

@app.get("/")
def root():
    return {"message": "Receiver system is running."}

app.include_router(sensor.router, prefix="/sensor", tags=["Sensor"])