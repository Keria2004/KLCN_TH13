import sys
import os

# ===== FIX PYTHONPATH =====
# Lấy thư mục gốc PROJECT = thư mục DL/
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(PROJECT_ROOT)

# ===== IMPORT =====
import cv2
import numpy as np
import time
from ultralytics import YOLO
from utils.preprocessor import preprocess_input, _imresize

# ===== MODEL PATHS =====
MODEL_DIR = os.path.join(PROJECT_ROOT, "models")

FACE_MODEL_PATH = os.path.join(MODEL_DIR, "face_detection.pt")
EMOTION_MODEL_PATH = os.path.join(MODEL_DIR, "fer_YOLOv1.pt")

print("Using face model:", FACE_MODEL_PATH)
print("Using emotion model:", EMOTION_MODEL_PATH)

# Load models
face_model = YOLO(FACE_MODEL_PATH)
print("✅ Face detection model loaded!")

emotion_model = YOLO(EMOTION_MODEL_PATH)
print("✅ Emotion model loaded!")

EMOTION_LABELS = ["Anger", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

# ===============================
# TẠO MÀU NHÃN
# ===============================
def get_color(label_index: int):
    np.random.seed(label_index)
    return tuple(int(x) for x in np.random.randint(0, 255, 3))


# ===============================
# MỞ WEBCAM
# ===============================
cv2.namedWindow("Emotion Detection YOLO")
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Không mở được webcam")
    exit()

print("✅ Webcam đã mở. Bấm 'q' để thoát.")


# ===============================
# VÒNG LẶP CHÍNH
# ===============================
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Resize frame để tiết kiệm tài nguyên
    resized_frame = cv2.resize(frame, (416, 416))

    # PHÁT HIỆN KHUÔN MẶT
    face_results = face_model(resized_frame, imgsz=416, conf=0.5, verbose=False)[0]

    # DUYỆT TỪNG KHUÔN MẶT
    for box in face_results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
        conf_face = float(box.conf)

        # Crop face
        face_crop = resized_frame[y1:y2, x1:x2]
        if face_crop.size == 0:
            continue

        # ======== PREPROCESS INPUT ========
        # Resize (using preprocessor)
        face_resized = _imresize(face_crop, (416, 416))

        # Normalize pixel values
        face_norm = preprocess_input(face_resized, v2=True)

        # YOLO expects uint8 BGR → convert ngược lại
        face_norm = ((face_norm + 1) / 2 * 255).astype("uint8")

        # Nhận diện cảm xúc
        emotion_results = emotion_model(face_norm, imgsz=416, conf=0.5, verbose=False)[0]

        # Nếu tìm thấy cảm xúc
        if len(emotion_results.boxes) > 0:
            best_box = emotion_results.boxes[emotion_results.boxes.conf.argmax()]
            cls_id = int(best_box.cls)
            conf_emotion = float(best_box.conf)

            if cls_id < len(EMOTION_LABELS):
                emotion_label = f"{EMOTION_LABELS[cls_id]} ({conf_emotion:.2f})"
            else:
                emotion_label = f"Unknown ({conf_emotion:.2f})"

            color = get_color(cls_id)

        # ======== DRAW BOUNDING BOX ========
        cv2.rectangle(resized_frame, (x1, y1), (x2, y2), color, 2)

        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.7
        thickness = 2

        text_size = cv2.getTextSize(emotion_label, font, font_scale, thickness)[0]

        cv2.rectangle(
            resized_frame,
            (x1, y1 - text_size[1] - 10),
            (x1 + text_size[0] + 10, y1),
            color,
            -1,
        )
        cv2.putText(
            resized_frame,
            emotion_label,
            (x1 + 5, y1 - 5),
            font,
            font_scale,
            (255, 255, 255),
            thickness,
        )

    # ======== SHOW FPS ========
    cv2.imshow("Emotion Detection YOLO", resized_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
