from app.utils.pyramid import build_laplacian_pyramid_video, reconstruct_video_from_pyramid
from app.utils.transforms import temporal_ideal_filter
import numpy as np
import cv2
from scipy.fftpack import fft, ifft

def run_evm_pipeline(input_path, output_path, amplification, freq_min, freq_max, pyramid_levels, fps, skip_levels_at_top=1):
    cap = cv2.VideoCapture(input_path)
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frames.append(frame)
    cap.release()

    frames = np.array(frames, dtype='float')
    pyramid = build_laplacian_pyramid_video(frames, pyramid_levels)
    filtered_pyramid = []
    for level in pyramid:
        filtered_level = temporal_ideal_filter(level, freq_min, freq_max, fps)
        filtered_pyramid.append(filtered_level)

    amplified = [level * amplification for level in filtered_pyramid]
    result = reconstruct_video_from_pyramid(amplified)
    result = frames + result

    # Contrast stretching:
    min_val = result.min()
    max_val = result.max()
    result = (result - min_val) / (max_val - min_val) * 255
    #result = np.clip(result, 0, 255).astype(np.uint8)
    result = np.clip(result, 0, 255).astype(np.uint8)
# Apply CLAHE to each frame
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_result = []

    for frame in result:
        gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)  # Already grayscale, but ensure 1-channel
        clahe_frame = clahe.apply(gray)
        clahe_rgb = cv2.cvtColor(clahe_frame, cv2.COLOR_GRAY2RGB)  # Convert back to RGB for saving
        enhanced_result.append(clahe_rgb)

    result = enhanced_result
    #result = np.array([contrast_stretching(frame) for frame in result])
    height, width = result[0].shape[:2]
    out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'XVID'), fps, (width, height))
    for frame in result:
        out.write(cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
    out.release()
