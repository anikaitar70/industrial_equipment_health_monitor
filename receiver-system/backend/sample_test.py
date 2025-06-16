import requests
import os
import cv2
import numpy as np
from datetime import datetime
from pathlib import Path
import time

ESP32_IP = "192.168.57.116"
READY_URL = f"http://{ESP32_IP}/ready"
FRAME_URL = f"http://{ESP32_IP}/frame"

def rgb565_to_bgr(raw_data, width, height):
    arr = np.frombuffer(raw_data, dtype=np.uint16).reshape((height, width))
    arr = arr.byteswap()
    arr = arr.astype(np.uint16)
    arr = arr.view(dtype=np.uint8).reshape((height, width, 2))
    bgr = cv2.cvtColor(arr, cv2.COLOR_BGR5652BGR)
    return bgr

def tell_esp_ready_and_wait():
    try:
        print("📨 Sending initial /ready signal to ESP32...")
        requests.get(READY_URL, timeout=10)
    except Exception as e:
        print(f"❌ Could not notify ESP32 initially: {e}")
        return False

    print("⏳ Waiting for ESP32 to finish capturing video...")
    for _ in range(60):  # Retry for ~5 minutes
        try:
            res = requests.get(READY_URL, timeout=180)
            if "ready" in res.text.lower() or "video is ready" in res.text.lower():
                print("✅ ESP32 confirmed video is ready.")
                return True
            else:
                print(f"⏳ ESP response: {res.text.strip()}")
        except Exception as e:
            print(f"⚠️ Error polling ESP32: {e}")

        time.sleep(5)

    print("❌ Timeout waiting for ESP32 to be ready.")
    return False

def fetch_frame(i, retries=3):
    frame_url = f"{FRAME_URL}?i={i}"
    for attempt in range(retries):
        print(f"🌐 Attempting to fetch frame {i} (try {attempt + 1}) from: {frame_url}")
        try:
            response = requests.get(frame_url, timeout=(10,30))
            print(f"🔁 Response status: {response.status_code}")
            if response.status_code != 200:
                time.sleep(2)
                continue
            width = int(response.headers.get("X-Width", 320))
            height = int(response.headers.get("X-Height", 240))
            return response.content, width, height
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Error fetching frame {i} (attempt {attempt+1}): {e}")
            time.sleep(2)
    print(f"❌ Failed to fetch frame {i} after {retries} retries.")
    return None, None, None


def main():
    print(f"📡 Starting frame collection from ESP32 at {ESP32_IP}")
    if not tell_esp_ready_and_wait():
        return

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    save_dir = Path(f"esp32_sessions/{timestamp}")
    save_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Session folder: {save_dir}")

    i = 0
    while True:
        frame_data, width, height = fetch_frame(i)
        if not frame_data or not width or not height:
            print(f"📴 No more frames or error occurred. Ending at frame {i}")
            break

        expected_size = width * height * 2
        if len(frame_data) != expected_size:
            print(f"[{i}] ⚠️ Unexpected frame size: got {len(frame_data)}, expected {expected_size}")
            break

        bgr_img = rgb565_to_bgr(frame_data, width, height)
        save_path = save_dir / f"frame_{i:03d}.png"
        cv2.imwrite(str(save_path), bgr_img)
        print(f"[{i}] ✅ Frame saved: {save_path}")
        i += 1

    print("📦 Done collecting video frames.")

if __name__ == "__main__":
    main()
