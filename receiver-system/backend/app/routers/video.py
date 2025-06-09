from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from app.utils.video_handler import save_upload_file, convert_to_grayscale
from pathlib import Path
import shutil
import uuid

router = APIRouter()

# Define upload directory (relative to the backend root)
UPLOAD_DIR = Path("storage/incoming")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload")
async def upload_video(file: UploadFile = File(...), equipment_id: str = Form(...)):
    try:
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{equipment_id}_{uuid.uuid4()}{file_extension}"
        file_location = UPLOAD_DIR / unique_filename
        save_upload_file(file, file_location)
        gray_path = file_location.parent / f"gray_{unique_filename}"
        convert_to_grayscale(file_location, gray_path)
        # Save file to storage
        with file_location.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return JSONResponse(status_code=200, content={
            "message": "Video uploaded successfully",
            "filename": unique_filename
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={
            "message": f"An error occurred: {str(e)}"
        })

