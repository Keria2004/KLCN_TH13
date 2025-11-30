import sys
import os
import cv2
import numpy as np
import logging

logger = logging.getLogger(__name__)

# ================================
# FIX PYTHONPATH
# ================================
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
BACKEND_PATH = os.path.join(PROJECT_ROOT, "Backend")
UTILS_PATH   = os.path.join(PROJECT_ROOT, "DeepLearning", "utils")

sys.path.append(BACKEND_PATH)
sys.path.append(UTILS_PATH)

# ================================
# IMPORT SERVICES / UTILS
# ================================
from app.service.ai_service import get_models
from preprocessor import preprocess_input, _imresize

# ================================
# LOAD MODELS
# ================================
face_model, emotion_model, EMOTION_LABELS = get_models()
logger.info(f"✅ Models loaded. Emotion labels: {EMOTION_LABELS}")

POSITIVE = ["Happy", "Surprise"]
NEGATIVE = ["Anger", "Disgust", "Fear", "Sad"]
NEUTRAL  = ["Neutral"]


# ================================
# MAIN FUNCTION
# ================================
def process_frame(frame: np.ndarray):
    """
    Phân tích cảm xúc từ 1 frame (numpy BGR)
    """
    try:
        if frame is None:
            logger.error("Frame is None")
            return {
                "faces": [],
                "emotion_distribution": {label: 0 for label in EMOTION_LABELS},
                "current_emotion": "Unknown",
                "positive_rate": 0
            }

        # ---------------------------
        # STEP 1: DETECT FACE
        # ---------------------------
        logger.debug(f"Processing frame shape: {frame.shape}")
        face_results = face_model(frame, imgsz=640, conf=0.5, verbose=False)[0]
        num_faces = len(face_results.boxes) if face_results.boxes else 0
        logger.debug(f"Detected {num_faces} faces")

        faces_output = []
        emotion_count = {label: 0 for label in EMOTION_LABELS}
        positive_count = 0

        # ---------------------------
        # STEP 2: EMOTION DETECTION
        # ---------------------------
        for idx, box in enumerate(face_results.boxes):
            try:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                crop = frame[y1:y2, x1:x2]

                if crop.size == 0:
                    logger.warning(f"Face {idx}: Empty crop detected")
                    continue

                # PREPROCESS
                resized = _imresize(crop, (256, 256))
                norm = preprocess_input(resized, v2=True)
                final_img = ((norm + 1) / 2 * 255).astype("uint8")

                # EMOTION YOLO
                emo_res = emotion_model(final_img, imgsz=256, conf=0.5, verbose=False)[0]
                num_emotions = len(emo_res.boxes) if emo_res.boxes else 0
                logger.debug(f"Face {idx}: Detected {num_emotions} emotions")

                if len(emo_res.boxes) > 0:
                    best = emo_res.boxes[emo_res.boxes.conf.argmax()]
                    cls = int(best.cls)
                    conf = float(best.conf)
                    emotion = EMOTION_LABELS[cls]
                else:
                    emotion = "Neutral"
                    conf = 0.0

                # COUNT
                emotion_count[emotion] += 1
                if emotion in POSITIVE:
                    positive_count += 1

                faces_output.append({
                    "bbox": [x1, y1, x2, y2],
                    "emotion": emotion,
                    "confidence": conf
                })
                logger.debug(f"Face {idx}: {emotion} ({conf:.2f})")
            except Exception as e:
                logger.error(f"Error processing face {idx}: {str(e)}", exc_info=True)
                continue

        total_faces = len(faces_output)
        positive_rate = int((positive_count / total_faces) * 100) if total_faces > 0 else 0

        # MOST COMMON EMOTION
        current_emotion = (
            max(emotion_count, key=emotion_count.get)
            if total_faces > 0 else "Unknown"
        )

        logger.debug(f"Frame result: {total_faces} faces, emotion={current_emotion}, positive_rate={positive_rate}%")

        # ---------------------------
        # FINAL OUTPUT
        # ---------------------------
        return {
            "faces": faces_output,
            "emotion_distribution": emotion_count,
            "current_emotion": current_emotion,
            "positive_rate": positive_rate
        }
    except Exception as e:
        logger.error(f"Error in process_frame: {str(e)}", exc_info=True)
        return {
            "faces": [],
            "emotion_distribution": {label: 0 for label in EMOTION_LABELS},
            "current_emotion": "Error",
            "positive_rate": 0
        }
