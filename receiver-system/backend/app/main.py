from fastapi import FastAPI
from app.routers import video, sensor
from app.routers import video  # make sure to have __init__.py files in the folders
from app.utils.video_handler import convert_to_grayscale, run_evm

app = FastAPI(title="Industrial Equipment Health Monitor Receiver")

app.include_router(video.router, prefix="/video", tags=["Video"])
grayscale_path = file_location.parent / f"{file_location.stem}_gray.mp4"
evm_output_path = file_location.parent / f"{file_location.stem}_evm.mp4"
@app.get("/")
def root():
    return {"message": "Receiver system is running."}

app.include_router(sensor.router, prefix="/sensor", tags=["Sensor"])