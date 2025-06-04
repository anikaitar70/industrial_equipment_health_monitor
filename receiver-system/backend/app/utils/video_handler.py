import cv2
from pathlib import Path
from app.utils.evm import run_evm_pipeline  # Use your modular EVM logic

def convert_to_grayscale(input_path: str, output_path: str) -> None:
    cap = cv2.VideoCapture(str(input_path))
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    out = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height), isColor=False)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        out.write(gray)

    cap.release()
    out.release()
    print(f"[INFO] Grayscale video saved to {output_path}")


def process_with_evm(input_path: str, output_path: str, fps=30):
    run_evm_pipeline(
        input_path=input_path,
        output_path=output_path,
        amplification=15,
        freq_min=0.5,
        freq_max=2.0,
        pyramid_levels=4,
        fps=fps
    )
    print(f"[INFO] EVM processed video saved to {output_path}")
