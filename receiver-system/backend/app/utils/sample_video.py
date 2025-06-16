import cv2
import os

# Settings
frames_folder = 'receiver-system/backend/storage/incoming/frames/'  # Folder containing your image frames
output_video_path = 'receiver-system/backend/storage/incoming/output_video.mp4'  # Output video file
fps = 15  # Frames per second

# Get list of frames and sort them
frame_files = sorted([f for f in os.listdir(frames_folder) if f.endswith(('.jpg', '.png'))])

# Read the first frame to get dimensions
first_frame = cv2.imread(os.path.join(frames_folder, frame_files[0]))
height, width, _ = first_frame.shape

# Define video writer
fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Use 'XVID' or 'MJPG' for .avi
video_writer = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

# Write each frame
for file_name in frame_files:
    frame_path = os.path.join(frames_folder, file_name)
    frame = cv2.imread(frame_path)
    video_writer.write(frame)

# Release the writer
video_writer.release()
print(f"Video saved to {output_video_path}")
