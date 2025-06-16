import socket
import struct
import numpy as np
import cv2
from pathlib import Path
from datetime import datetime

ESP32_IP = "192.168.57.116"
PORT = 4210
TOTAL_FRAMES = 900
WIDTH, HEIGHT = 640, 480
BYTES_PER_FRAME = WIDTH * HEIGHT * 2
FPS = 24

# Create save dirs
base_dir = Path("receiver-system/backend/storage/incoming")
frame_dir = base_dir / "frames"
base_dir.mkdir(parents=True, exist_ok=True)
frame_dir.mkdir(parents=True, exist_ok=True)

video_filename = datetime.now().strftime("video_%Y%m%d_%H%M%S.mp4")
video_path = base_dir / video_filename

def recv_exact(sock, size):
    """Receive exactly `size` bytes."""
    data = b""
    while len(data) < size:
        packet = sock.recv(size - len(data))
        if not packet:
            raise ConnectionError("Connection closed")
        data += packet
    return data

frames = {}

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    print("🔌 Connecting to ESP32...")
    s.connect((ESP32_IP, PORT))
    s.sendall(f"FRAMES:{TOTAL_FRAMES}\n".encode())

    for _ in range(TOTAL_FRAMES):
        index = struct.unpack("<I", recv_exact(s, 4))[0]
        length = struct.unpack("<I", recv_exact(s, 4))[0]
        frame_data = recv_exact(s, length)

        print(f"📥 Received frame {index} ({length} bytes)")

        arr = np.frombuffer(frame_data, dtype=np.uint16).reshape((HEIGHT, WIDTH))
        arr = arr.byteswap().astype(np.uint16)
        arr = arr.view(dtype=np.uint8).reshape((HEIGHT, WIDTH, 2))
        bgr = cv2.cvtColor(arr, cv2.COLOR_BGR5652BGR)

        frame_file = frame_dir / f"frame_{index:03d}.jpg"
        cv2.imwrite(str(frame_file), bgr)
        frames[index] = bgr

        s.sendall(f"ACK:{index}\n".encode())

    msg = s.recv(64).decode().strip()
    if msg == "DONE":
        print("✅ All frames received")

# Rebuild video
if frames:
    print(f"🎞️ Building video from {len(frames)} frames")
    out = cv2.VideoWriter(str(video_path), cv2.VideoWriter_fourcc(*"mp4v"), FPS, (WIDTH, HEIGHT))
    for i in sorted(frames.keys()):
        out.write(frames[i])
    out.release()
    print(f"🎉 Video saved: {video_path}")
