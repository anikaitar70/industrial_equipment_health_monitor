from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pathlib import Path
import time
import os

router = APIRouter()

INCOMING_DIR = Path("storage/incoming")

def generate_mjpeg_frames():
    while True:
        images = sorted(INCOMING_DIR.glob("*.jpg"), key=os.path.getmtime)
        for image_path in images:
            with open(image_path, "rb") as img_file:
                yield (b"--frame\r\n"
                       b"Content-Type: image/jpeg\r\n\r\n" + img_file.read() + b"\r\n")
            time.sleep(0.2)  # stream delay per frame

@router.get("/stream")
def stream():
    return StreamingResponse(generate_mjpeg_frames(), media_type="multipart/x-mixed-replace; boundary=frame")
