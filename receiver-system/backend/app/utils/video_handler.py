import cv2
from pathlib import Path
from app.utils.evm import run_evm_pipeline

def convert_to_grayscale(input_path: str, output_path: str, scale=0.5, max_frames=150) -> None:
    cap = cv2.VideoCapture(str(input_path))
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Read first frame to get scaled dimensions
    ret, frame = cap.read()
    if not ret:
        raise ValueError("Failed to read from input video.")

    frame = cv2.resize(frame, (0, 0), fx=scale, fy=scale)
    height, width = frame.shape[:2]
    out = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height), isColor=False)

    frame_count = 0
    while ret and frame_count < max_frames:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        out.write(gray)
        ret, frame = cap.read()
        if ret:
            frame = cv2.resize(frame, (0, 0), fx=scale, fy=scale)
        frame_count += 1

    cap.release()
    out.release()
    print(f"[INFO] Grayscale video saved to {output_path} with {frame_count} frames")


def process_with_evm(input_path: str, output_path: str, fps=30):
    run_evm_pipeline(
        input_path=input_path,
        output_path=output_path,
        amplification=50,
        freq_min=0.5,
        freq_max=2.0,
        pyramid_levels=3,       # reduced
        skip_levels_at_top=1,   # safer for memory
        fps=fps
    )
    print(f"[INFO] EVM processed video saved to {output_path}")
