from app.utils.video_handler import convert_to_grayscale, process_with_evm
from pathlib import Path

# Define paths
input_video = Path("storage/incoming/wrist.mp4")
gray_output = Path("storage/processed/wrist_gray.avi")
evm_output = Path("storage/processed/wrist_evm.avi")

# Make sure output dir exists
gray_output.parent.mkdir(parents=True, exist_ok=True)

# Run conversions
print("[1] Converting to Grayscale...")
convert_to_grayscale(str(input_video), str(gray_output))

print("[2] Running EVM...")
process_with_evm(str(gray_output), str(evm_output), fps=30)

print(f"[✔] Done. Output saved to {evm_output}")
