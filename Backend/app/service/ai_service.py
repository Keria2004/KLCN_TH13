import os
from ultralytics import YOLO

# ================================
# PATH SETUP
# ================================

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))                 # app/service/
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", ".."))  # KLCN_TH013/
MODEL_DIR = os.path.join(PROJECT_ROOT, "DeepLearning", "models")

EMOTION_MODEL_PATH = os.path.join(MODEL_DIR, "fer_YOLOv1.pt")
FACE_MODEL_PATH    = os.path.join(MODEL_DIR, "face_detection.pt")

# ================================
# CHECK MODEL EXISTENCE
# ================================
if not os.path.exists(EMOTION_MODEL_PATH):
    raise FileNotFoundError(f"Emotion model not found: {EMOTION_MODEL_PATH}")

if not os.path.exists(FACE_MODEL_PATH):
    raise FileNotFoundError(f"Face detection model not found: {FACE_MODEL_PATH}")


# ================================
# LOAD YOLO MODELS (cache-loading)
# ================================
emotion_model = YOLO(EMOTION_MODEL_PATH)
face_model    = YOLO(FACE_MODEL_PATH)

EMOTION_LABELS = [
    "Anger", "Disgust", "Fear",
    "Happy", "Neutral", "Sad", "Surprise"
]


def get_models():
    """
    Trả về models đã load sẵn.
    Load 1 lần duy nhất khi FastAPI khởi động.
    """
    return face_model, emotion_model, EMOTION_LABELS
