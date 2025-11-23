import sys
import os

# ===== FIX PYTHONPATH =====
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(PROJECT_ROOT)

# ===== IMPORT =====
import cv2
import numpy as np
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
emotion_model = YOLO(EMOTION_MODEL_PATH)

print("✅ Models loaded")

EMOTION_LABELS = ["Anger", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

def get_color(label_index: int):
    np.random.seed(label_index)
    return tuple(int(x) for x in np.random.randint(0, 255, 3))


# ===============================
# TEST ẢNH
# ===============================

image_path = r"D:\KLCN_TH013\DL\test\upload\images1.jpg"   # <--- THAY ẢNH CỦA BẠN VÀO ĐÂY

frame = cv2.imread(image_path)
if frame is None:
    print("❌ Không đọc được ảnh!")
    exit()

# Resize
resized_frame = cv2.resize(frame, (416, 416))

# Detect face
face_results = face_model(resized_frame, imgsz=416, conf=0.5, verbose=False)[0]

for box in face_results.boxes:
    x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())

    face_crop = resized_frame[y1:y2, x1:x2]
    if face_crop.size == 0:
        continue

    face_resized = _imresize(face_crop, (416, 416))
    face_norm = preprocess_input(face_resized, v2=True)
    face_norm = ((face_norm + 1) / 2 * 255).astype("uint8")

    # Detect emotion
    emotion_results = emotion_model(face_norm, imgsz=416, conf=0.5, verbose=False)[0]

    has_emotion = False

    if len(emotion_results.boxes) > 0:
        best_box = emotion_results.boxes[emotion_results.boxes.conf.argmax()]
        cls_id = int(best_box.cls)

        if cls_id < len(EMOTION_LABELS):
            emotion_label = f"{EMOTION_LABELS[cls_id]} ({float(best_box.conf):.2f})"
            color = get_color(cls_id)
            has_emotion = True
    else:
        color = (255, 255, 255)

    # Draw box
    cv2.rectangle(resized_frame, (x1, y1), (x2, y2), color, 2)

    # Label
    if has_emotion:
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


# SHOW RESULT
cv2.imshow("Emotion Detection - Image Test", resized_frame)
cv2.waitKey(0)
cv2.destroyAllWindows()
