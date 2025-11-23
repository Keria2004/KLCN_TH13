import sys
import os
import cv2
import numpy as np
from ultralytics import YOLO
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

# ===============================
# LOAD YOLO FACE DETECTOR
# ===============================
FACE_MODEL_PATH = r"D:\KLCN_TH013\DL\models\face_detection.pt"
face_model = YOLO(FACE_MODEL_PATH)
print("✅ YOLO face detector loaded!")

# ===============================
# LOAD CNN EMOTION MODEL (mini_XCEPTION)
# ===============================
CNN_EMOTION_PATH = r"D:\KLCN_TH013\DL\models\fer2013_mini_XCEPTION.102-0.66.hdf5"
emotion_model = load_model(CNN_EMOTION_PATH, compile=False)
print("✅ CNN emotion model loaded!")

# ===============================
# EMOTION LABELS
# ===============================
EMOTION_LABELS = ["Anger", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

# ===============================
# COLOR MAP (giữ nguyên của bạn)
# ===============================
def get_color(idx):
    np.random.seed(idx)
    return tuple(int(x) for x in np.random.randint(0, 255, 3))

# ===============================
# VIDEO SOURCE HERE
# ===============================
VIDEO_PATH = r"D:\KLCN_TH013\videos\videoplayback1.mp4"   # <-- sửa đường dẫn video của bạn

cap = cv2.VideoCapture(VIDEO_PATH)

if not cap.isOpened():
    print("❌ Không mở được video")
    print("Path:", VIDEO_PATH)
    exit()

print("🎬 Đang chạy video... Nhấn 'q' để thoát.")

# ===============================
# MAIN LOOP (VIDEO)
# ===============================
while True:
    ret, frame = cap.read()
    if not ret:
        print("⚠ Video kết thúc.")
        break

    img_show = frame.copy()

    # ========== FACE DETECTION (YOLO) ==========
    results = face_model(frame, imgsz=416, conf=0.5, verbose=False)[0]

    # ========== PROCESS TỪNG KHUÔN MẶT ==========
    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        face = frame[y1:y2, x1:x2]
        if face.size == 0:
            continue

        # ===== PREPROCESS CHO CNN =====
        face_gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
        face_resized = cv2.resize(face_gray, (64, 64))        # mini_XCEPTION input
        face_array = face_resized.astype("float") / 255.0
        face_array = img_to_array(face_array)
        face_array = np.expand_dims(face_array, axis=0)       # (1, 64, 64, 1)

        # ===== EMOTION CNN PREDICT =====
        preds = emotion_model.predict(face_array, verbose=0)[0]
        cls_id = np.argmax(preds)
        label = f"{EMOTION_LABELS[cls_id]} ({preds[cls_id]:.2f})"
        color = get_color(cls_id)

        # ===== DRAW OUTPUT =====
        cv2.rectangle(img_show, (x1, y1), (x2, y2), color, 2)

        cv2.putText(
            img_show,
            label,
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            color,
            2,
        )

    # ===============================
    # SHOW VIDEO FRAME
    # ===============================
    cv2.imshow("YOLO + CNN Emotion Detection (VIDEO)", img_show)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
