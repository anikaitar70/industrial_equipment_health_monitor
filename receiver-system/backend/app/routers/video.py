from fastapi import APIRouter, Request, Form
from fastapi.responses import JSONResponse
from app.utils.video_handler import save_upload_file, convert_to_grayscale
from pathlib import Path
import uuid
import os

router = APIRouter()

# Define upload directory (relative to the backend root)
UPLOAD_DIR = Path("storage/incoming")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload")
async def upload_video(request: Request, equipment_id: str = Form(...)):
    try:
        # Read the raw binary data from the request body
        video_data = await request.body()
        
        if not video_data:
            return JSONResponse(status_code=400, content={
                "message": "No video data received"
            })

        # Generate unique filename
        unique_filename = f"{equipment_id}_{uuid.uuid4()}.jpg"
        file_location = UPLOAD_DIR / unique_filename
        
        # Save the received binary data to a file
        with open(file_location, "wb") as f:
            f.write(video_data)
        
        # Convert to grayscale (if needed)
        gray_path = file_location.parent / f"gray_{unique_filename}"
        convert_to_grayscale(file_location, gray_path)

        return JSONResponse(status_code=200, content={
            "message": "Video uploaded successfully",
            "filename": unique_filename
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={
            "message": f"An error occurred: {str(e)}"
        })
