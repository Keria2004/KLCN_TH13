import sys
import os
import cv2
import time
from ultralytics import YOLO
import numpy as np

# ===============================
# FIX PYTHONPATH (IMPORT utils)
# ===============================
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(PROJECT_ROOT)

from utils.preprocessor import preprocess_input, _imresize

# ===============================
# MODEL PATHS (tương đối – đúng mọi máy)
# ===============================
MODEL_DIR = os.path.join(PROJECT_ROOT, "models")

FACE_MODEL_PATH = os.path.join(MODEL_DIR, "face_detection.pt")
EMOTION_MODEL_PATH = os.path.join(MODEL_DIR, "fer_YOLOv1.pt")

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
    exit()

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
    return (255, 255, 255)      # fallback

# ===============================
# VIDEO INPUT (relative path OK)
# ===============================
VIDEO_PATH = os.path.join(PROJECT_ROOT, "videos", "videoplayback1.mp4")

cap = cv2.VideoCapture(VIDEO_PATH)

if not cap.isOpened():
    print("❌ Cannot open video.")
    print("Path:", VIDEO_PATH)
    exit()

print("🎬 Processing... Press 'q' to quit.")

# ===============================
# TIME-BASED DETECTION
# ===============================
CAPTURE_INTERVAL = 1.0  # seconds
last_capture_time = 0

# ===============================
# MAIN LOOP
# ===============================
while True:
    ret, frame = cap.read()
    if not ret:
        break

    current_time = time.time()

    # Chỉ detect mỗi 1 giây
    if current_time - last_capture_time >= CAPTURE_INTERVAL:
        last_capture_time = current_time

        # ===== FACE DETECTION =====
        face_results = face_model(frame, imgsz=640, conf=0.5, verbose=False)[0]

        for box in face_results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            face_crop = frame[y1:y2, x1:x2]
            if face_crop.size == 0:
                continue

            # ===== PREPROCESS =====
            face_resized = _imresize(face_crop, (416, 416))
            face_norm = preprocess_input(face_resized, v2=True)
            face_input = ((face_norm + 1) / 2 * 255).astype("uint8")

            # ===== EMOTION DETECTION =====
            emotion_results = emotion_model(face_input, imgsz=416, conf=0.5, verbose=False)[0]

            if len(emotion_results.boxes) > 0:
                best = emotion_results.boxes[emotion_results.boxes.conf.argmax()]
                cls = int(best.cls)
                emo = EMOTION_LABELS[cls]
                conf_em = float(best.conf)

                label = f"{emo} ({conf_em:.2f})"
                color = get_color_by_emotion(emo)
            else:
                label = "No emotion"
                color = (0, 255, 255)

            # ===== DRAW =====
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

    # Show frame
    cv2.imshow("Time-Based Emotion Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
