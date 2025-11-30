import sys
import os
import cv2
import time
import numpy as np
from ultralytics import YOLO

# ===============================
# FIX PYTHONPATH (IMPORT utils)
# ===============================
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(PROJECT_ROOT)

from utils.preprocessor import preprocess_input, _imresize

# ===============================
# MODEL PATHS (relative – works anywhere)
# ===============================
MODEL_DIR = os.path.join(PROJECT_ROOT, "models")

FACE_MODEL_PATH = os.path.join(MODEL_DIR, "face_detection.pt")
EMOTION_MODEL_PATH = os.path.join(MODEL_DIR, "best.pt")

print("Using face model:", FACE_MODEL_PATH)
print("Using emotion model:", EMOTION_MODEL_PATH)

# ===============================
# EMOTION LABELS
# ===============================
EMOTION_LABELS = [
    "Anger", "Disgust", "Fear",
    "Happy", "Neutral", "Sad", "Surprise"
]

# ===============================
# LOAD MODELS
# ===============================
try:
    face_model = YOLO(FACE_MODEL_PATH)
    print("✅ Face model loaded!")

    emotion_model = YOLO(EMOTION_MODEL_PATH)
    print("✅ Emotion model loaded!")

except Exception as e:
    print("❌ ERROR loading models:", e)
    sys.exit()

# ===============================
# EMOTION COLOR MAP
# ===============================
def get_color_by_emotion(emo):
    positive = ["Happy", "Surprise"]
    negative = ["Anger", "Disgust", "Fear", "Sad"]
    neutral = ["Neutral"]

    if emo in positive:
        return (0, 255, 0)      # Green
    if emo in negative:
        return (0, 0, 255)      # Red
    if emo in neutral:
        return (0, 255, 255)    # Yellow

# ===============================
# VIDEO INPUT
# ===============================
VIDEO_PATH = r"D:\KLCN_TH13-master\videos\video1.mp4"


cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print("❌ Cannot open video.")
    print("Path:", VIDEO_PATH)
    sys.exit()

# 📊 Lấy thông tin video
video_fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
video_duration = total_frames / video_fps if video_fps > 0 else 0

print(f"🎬 Video Info:")
print(f"   FPS: {video_fps}")
print(f"   Total frames: {total_frames}")
print(f"   Duration: {video_duration:.2f} seconds")

# 📊 Tính detection frame interval
# Detect cứ 2 frame = half FPS (nhanh hơn nhưng vẫn smooth)
DETECT_FRAME_INTERVAL = 2
actual_detect_fps = video_fps / DETECT_FRAME_INTERVAL
print(f"   Detection FPS: {actual_detect_fps:.1f} (mỗi {DETECT_FRAME_INTERVAL} frame)")
print("🎬 Processing... Press 'q' to quit.\n")

# ===============================
# FRAME COUNTER FOR DETECTION
# ===============================
frame_count = 0

# ===============================
# MAIN LOOP
# ===============================
while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1

    # 📊 Detect mỗi N frame (frame-based thay vì time-based)
    if frame_count % DETECT_FRAME_INTERVAL == 0:

        # ===== FACE DETECTION =====
        face_results = face_model(frame, imgsz=640, conf=0.5, verbose=False)[0]

        for box in face_results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            face_crop = frame[y1:y2, x1:x2]
            if face_crop.size == 0:
                continue

            # ===== PREPROCESS =====
            face_resized = _imresize(face_crop, (256, 256))
            face_norm = preprocess_input(face_resized, v2=True)
            face_input = ((face_norm + 1) / 2 * 255).astype("uint8")

            # ===== EMOTION DETECTION =====
            emotion_results = emotion_model(face_input, imgsz=256, conf=0.5, verbose=False)[0]

            has_emotion = False  # đánh dấu có nhãn hay không

            if len(emotion_results.boxes) > 0:
                best = emotion_results.boxes[emotion_results.boxes.conf.argmax()]
                cls = int(best.cls)
                emo = EMOTION_LABELS[cls]
                conf_em = float(best.conf)

                label = f"{emo} ({conf_em:.2f})"
                color = get_color_by_emotion(emo)
                has_emotion = True
            else:
                color = (255, 255, 255)  # chỉ vẽ khung trắng

            # ===== DRAW =====
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

            if has_emotion:
                cv2.putText(frame, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                            (255, 255, 255), 2)

    # Show frame
    cv2.imshow("Frame-Based Emotion Detection (FPS: {:.1f})".format(actual_detect_fps), frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
