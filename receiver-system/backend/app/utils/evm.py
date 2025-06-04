from app.utils.pyramid import build_laplacian_pyramid_video, reconstruct_video_from_pyramid
from app.utils.transforms import temporal_ideal_filter
import numpy as np
import cv2
from scipy.fftpack import fft, ifft

def run_evm_pipeline(input_path, output_path, amplification, freq_min, freq_max, pyramid_levels, fps):
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
# Now reconstruct the video from filtered pyramid
    #result = reconstruct_video_from_pyramid(filtered_pyramid)
    amplified = filtered_pyramid * amplification
    result = reconstruct_video_from_pyramid(amplified)
    result = np.clip(frames + result, 0, 255).astype(np.uint8)

    height, width = result[0].shape[:2]
    out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'XVID'), fps, (width, height))
    for frame in result:
        out.write(cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
    out.release()
