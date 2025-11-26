import cv2
import numpy as np
from io import BytesIO
import logging
import imageio
import json
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from app.service.emotion_service import process_frame

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/monitoring",
    tags=["Monitoring"]
)

# ================================
# Convert bytes → OpenCV frame
# ================================
def bytes_to_frame(data: bytes):
    arr = np.frombuffer(data, dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


# =====================================
# 1) API nhận 1 FRAME từ FE
# =====================================
@router.post("/frame")
async def detect_frame(file: UploadFile = File(...)):
    """Nhận 1 ảnh (frame) → phân tích cảm xúc."""
    data = await file.read()

    frame = bytes_to_frame(data)
    if frame is None:
        raise HTTPException(status_code=400, detail="Cannot decode frame")

    return process_frame(frame)


# =====================================
# 2) API nhận VIDEO → phân tích từng frame
# =====================================
@router.post("/upload-video/")
async def detect_video(file: UploadFile = File(...), frame_step: int = 10):
    import tempfile
    import os

    logger.info(f"📹 Received video upload: {file.filename}, size: {file.size}, content_type: {file.content_type}")

    # Validate file
    if not file:
        logger.error("No file provided")
        raise HTTPException(status_code=400, detail="No file provided")
    
    if file.size == 0:
        logger.error("File is empty")
        raise HTTPException(status_code=400, detail="File is empty")

    # đọc bytes
    video_bytes = await file.read()
    logger.info(f"Read {len(video_bytes)} bytes from file")
    
    if not video_bytes:
        logger.error("Cannot read file bytes")
        raise HTTPException(status_code=400, detail="Cannot read file")

    # Determine file extension from filename or use mp4 as default
    file_ext = ".mp4"
    if file.filename:
        _, ext = os.path.splitext(file.filename)
        if ext:
            file_ext = ext
    
    logger.info(f"Using file extension: {file_ext}")

    # tạo file tạm (delete=False để giữ file)
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=file_ext)
    temp_file_path = temp_file.name
    logger.info(f"Created temp file: {temp_file_path}")
    
    try:
        temp_file.write(video_bytes)
        temp_file.flush()
        temp_file.close()
        logger.info(f"Temp file written successfully, size: {os.path.getsize(temp_file_path)} bytes")

        # Try OpenCV first
        cap = cv2.VideoCapture(temp_file_path)
        use_opencv = cap.isOpened()
        
        if not use_opencv:
            logger.warning("OpenCV failed, trying imageio...")
            cap = None

        # If OpenCV fails, use imageio
        timeline = []
        index = 0
        frame_count = 0

        if use_opencv:
            logger.info("Using OpenCV for video decoding")
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0
            logger.info(f"Total frames: {total_frames}")

            if total_frames == 0:
                cap.release()
                logger.error("Video has no frames (OpenCV)")
                raise HTTPException(status_code=400, detail="Video has no frames or is corrupted")

            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                if index % frame_step == 0:
                    try:
                        info = process_frame(frame)
                        logger.debug(f"Frame {index}: emotion={info['current_emotion']}, positive_rate={info['positive_rate']}%")
                        timeline.append({
                            "frame": index,
                            "current_emotion": info["current_emotion"],
                            "positive_rate": info["positive_rate"],
                            "emotion_distribution": info["emotion_distribution"]
                        })
                        frame_count += 1
                    except Exception as e:
                        logger.error(f"Error processing frame {index}: {str(e)}", exc_info=True)
                        continue

                index += 1

            cap.release()
        else:
            # Use imageio as fallback
            logger.info("Using imageio for video decoding")
            try:
                reader = imageio.get_reader(temp_file_path)
                total_frames = len(reader)
                logger.info(f"Total frames (imageio): {total_frames}")

                if total_frames == 0:
                    logger.error("Video has no frames (imageio)")
                    raise HTTPException(status_code=400, detail="Video has no frames or is corrupted")

                for index, frame in enumerate(reader):
                    if index % frame_step == 0:
                        # Convert RGB (imageio) to BGR (OpenCV format)
                        if len(frame.shape) == 3:
                            frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
                        else:
                            frame_bgr = frame
                        
                        try:
                            info = process_frame(frame_bgr)
                            logger.debug(f"Frame {index}: emotion={info['current_emotion']}, positive_rate={info['positive_rate']}%")
                            timeline.append({
                                "frame": index,
                                "current_emotion": info["current_emotion"],
                                "positive_rate": info["positive_rate"],
                                "emotion_distribution": info["emotion_distribution"]
                            })
                            frame_count += 1
                        except Exception as e:
                            logger.error(f"Error processing frame {index}: {str(e)}", exc_info=True)
                            continue

                reader.close()
            except Exception as e:
                logger.error(f"imageio failed: {str(e)}", exc_info=True)
                raise HTTPException(
                    status_code=400,
                    detail=f"Cannot decode video - unsupported format or codec. Error: {str(e)}"
                )

        logger.info(f"Processed {frame_count} frames, timeline entries: {len(timeline)}")

        if len(timeline) == 0:
            logger.error("No frames could be analyzed")
            raise HTTPException(status_code=400, detail="No frames could be analyzed from video")

        result = {
            "frames_total": total_frames,
            "frames_analyzed": len(timeline),
            "timeline": timeline
        }
        logger.info("Video processing completed successfully")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
    finally:
        # Clean up temp file
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
                logger.info(f"Temp file deleted: {temp_file_path}")
            except Exception as e:
                logger.warning(f"Could not delete temp file: {e}")


# =====================================
# 3) API GET EMOTION ANALYTICS
# =====================================
@router.post("/analytics")
async def get_analytics(data: dict):
    """
    Nhận timeline dữ liệu từ FE → trả về analytics
    """
    try:
        timeline = data.get("timeline", [])
        
        if not timeline:
            raise HTTPException(status_code=400, detail="Empty timeline")
        
        # Aggregate emotion data
        emotion_dist = {}
        positive_count = 0
        total_count = len(timeline)
        emotion_over_time = []
        
        for entry in timeline:
            emotion = entry.get("current_emotion", "Unknown")
            dist = entry.get("emotion_distribution", {})
            
            # Accumulate emotion distribution
            for emo, count in dist.items():
                emotion_dist[emo] = emotion_dist.get(emo, 0) + count
            
            # Track positive emotions
            if emotion in ["Happy", "Surprise"]:
                positive_count += 1
            
            # Timeline entry
            emotion_over_time.append({
                "frame": entry.get("frame"),
                "emotion": emotion,
                "positive_rate": entry.get("positive_rate", 0)
            })
        
        positive_rate = int((positive_count / total_count) * 100) if total_count > 0 else 0
        
        # Most dominant emotion
        dominant_emotion = max(emotion_dist, key=emotion_dist.get) if emotion_dist else "Unknown"
        
        # Teaching insights
        insights = []
        if positive_rate >= 75:
            insights.append("✅ Lớp rất hứng thú - Tiếp tục phương pháp hiện tại!")
        elif positive_rate >= 50:
            insights.append("👍 Lớp có hứng thú tốt - Có thể cải thiện một chút")
        elif positive_rate >= 25:
            insights.append("⚠️ Chú ý: Sự hứng thú giảm - Hãy tăng tương tác")
        else:
            insights.append("❌ Lớp thiếu hứng thú - Cần thay đổi phương pháp dạy")
        
        return {
            "total_samples": total_count,
            "dominant_emotion": dominant_emotion,
            "positive_rate": positive_rate,
            "emotion_distribution": emotion_dist,
            "emotion_over_time": emotion_over_time,
            "teaching_insights": insights
        }
    
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analytics error: {str(e)}")


# =====================================
# 4) API HEALTH CHECK
# =====================================
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "emotion_monitoring"
    }

