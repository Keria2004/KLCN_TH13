# System Architecture & Data Flow

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER (Client)                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  React SPA (localhost:5173)                                   │ │
│  │  ├─ Pages: Home, Monitor, Analytics, Report                  │ │
│  │  ├─ Components: LiveMonitoring, VideoUpload, Dashboard       │ │
│  │  ├─ Charts: Bar, Pie, Line (Recharts)                        │ │
│  │  └─ State Management: React Hooks (useState, useEffect)      │ │
│  └───────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                    HTTP REST API (Axios, JSON)
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (FastAPI)                        │
│                      (localhost:8000)                              │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ API Routes (CORS enabled)                                     │ │
│  ├─ POST /monitoring/frame → analyze single image               │ │
│  ├─ POST /monitoring/upload-video/ → analyze video file         │ │
│  ├─ POST /monitoring/analytics → compute insights               │ │
│  └─ GET /monitoring/health → service status                     │ │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Services                                                      │ │
│  ├─ emotion_service.py → process_frame()                        │ │
│  │   ├─ Face detection with YOLOv1 model                        │ │
│  │   ├─ Emotion classification with YOLOv1                      │ │
│  │   ├─ Bounding box + confidence extraction                    │ │
│  │   └─ Emotion distribution calculation                        │ │
│  ├─ ai_service.py → get_models()                                │ │
│  │   ├─ Load face_detection.pt                                  │ │
│  │   ├─ Load fer_YOLOv1.pt                                      │ │
│  │   └─ Cache models in memory                                  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Utilities                                                     │ │
│  ├─ Video Decoding (OpenCV + imageio fallback)                  │ │
│  ├─ Frame Extraction (every N frames)                           │ │
│  ├─ Image Preprocessing (resize, normalize)                     │ │
│  └─ Error Handling & Logging                                    │ │
│  └───────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                      Deep Learning Model Loading
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    DEEP LEARNING MODELS                             │
│                     (Ultralytics YOLOv1)                            │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Model 1: Face Detection (face_detection.pt)                  │ │
│  ├─ Input: BGR Image (H × W × 3)                                │ │
│  ├─ Process: YOLO inference at 640px resolution                 │ │
│  ├─ Output: Bounding boxes [x1, y1, x2, y2] with confidence    │ │
│  └─ Backend: PyTorch or ONNX runtime                            │ │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Model 2: Emotion Recognition (fer_YOLOv1.pt)                │ │
│  ├─ Input: Cropped face region (416 × 416)                      │ │
│  ├─ Process: Preprocess → YOLO inference → emotion class        │ │
│  ├─ Output: Emotion label (7 classes)                           │ │
│  │   Classes: Anger, Disgust, Fear, Happy, Neutral, Sad,       │ │
│  │            Surprise                                          │ │
│  └─ Backend: PyTorch or ONNX runtime                            │ │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Model 3: Backup (fer2013_mini_XCEPTION.hdf5)               │ │
│  ├─ Keras/TensorFlow model (optional fallback)                  │ │
│  └─ Can be used if YOLO inference fails                         │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### Live Monitoring Flow

```
START Webcam Stream
    │
    ├─ navigator.mediaDevices.getUserMedia({video: true})
    │  └─ Get camera permission
    │
    ├─ Set video.srcObject = stream
    │
    ├─ Draw video frame to Canvas element
    │
    ├─ Convert Canvas → JPEG blob (0.8 quality)
    │
    ├─ Create FormData, append blob as "file"
    │
    ├─ POST http://localhost:8000/monitoring/frame
    │  │
    │  └─ BACKEND PROCESSING:
    │     ├─ Read image bytes
    │     ├─ Decode to OpenCV BGR format
    │     ├─ Run face detection model (640px)
    │     ├─ For each detected face:
    │     │  ├─ Crop face region
    │     │  ├─ Resize to 416×416
    │     │  ├─ Normalize pixel values
    │     │  ├─ Run emotion model
    │     │  └─ Get emotion class + confidence
    │     ├─ Count emotion distribution
    │     ├─ Calculate positive rate
    │     ├─ Get dominant emotion
    │     └─ Return JSON response
    │
    ├─ FRONTEND RECEIVES:
    │  {
    │    "faces": [
    │      {"bbox": [x1,y1,x2,y2], "emotion": "Happy", "confidence": 0.95},
    │      {...}
    │    ],
    │    "emotion_distribution": {"Happy": 3, "Neutral": 1, ...},
    │    "current_emotion": "Happy",
    │    "positive_rate": 75
    │  }
    │
    ├─ Update React state (setCurrentEmotion, setPositiveRate, etc.)
    │
    ├─ Update UI:
    │  ├─ Large emotion display with color
    │  ├─ Positive rate progress bar
    │  ├─ Face count badge
    │  └─ Emotion distribution mini-chart
    │
    ├─ Schedule next analysis in 500ms
    │
    └─ REPEAT until Stop clicked

STOP Webcam Stream
    ├─ Stop all setTimeout callbacks
    ├─ Release camera stream (getTracks().stop())
    └─ Clean up resources
```

### Video Analysis Flow

```
SELECT Video File
    │
    ├─ Validate:
    │  ├─ Type: MP4, AVI, MOV
    │  └─ Size: < 500MB
    │
    ├─ Create FormData with file + frame_step=5
    │
    ├─ POST http://localhost:8000/monitoring/upload-video/
    │  │
    │  └─ BACKEND PROCESSING:
    │     ├─ Save bytes to temporary file
    │     │
    │     ├─ Try OpenCV: cv2.VideoCapture(temp_path)
    │     │  OR
    │     │  Fallback to imageio.get_reader()
    │     │
    │     ├─ Get total frame count
    │     │
    │     ├─ FOR each frame in video (step=5):
    │     │  ├─ Extract frame
    │     │  ├─ Convert RGB→BGR if needed
    │     │  ├─ Call process_frame(frame)
    │     │  │  ├─ Detect faces
    │     │  │  ├─ Recognize emotions
    │     │  │  └─ Get results
    │     │  │
    │     │  ├─ Append to timeline:
    │     │  │  {
    │     │  │    "frame": 0,
    │     │  │    "current_emotion": "Happy",
    │     │  │    "positive_rate": 80,
    │     │  │    "emotion_distribution": {...}
    │     │  │  }
    │     │  │
    │     │  └─ Log progress
    │     │
    │     ├─ Delete temporary file
    │     │
    │     └─ Return:
    │        {
    │          "frames_total": 300,
    │          "frames_analyzed": 60,
    │          "timeline": [...]
    │        }
    │
    ├─ FRONTEND RECEIVES timeline
    │
    ├─ Store in state: setAnalysisData(data)
    │
    ├─ Automatically switch to Analytics tab
    │
    └─ POST to /monitoring/analytics
       │
       └─ BACKEND COMPUTING INSIGHTS:
          ├─ Aggregate emotion_distribution from all frames
          ├─ Count positive emotions (Happy + Surprise)
          ├─ Calculate positive_rate percentage
          ├─ Find dominant_emotion (max count)
          ├─ Build emotion_over_time timeline
          ├─ Generate teaching_insights:
          │  ├─ If positive_rate >= 75%
          │  │  └─ "✅ Lớp rất hứng thú..."
          │  ├─ If positive_rate >= 50%
          │  │  └─ "👍 Lớp có hứng thú tốt..."
          │  └─ etc.
          │
          └─ Return:
             {
               "total_samples": 60,
               "dominant_emotion": "Happy",
               "positive_rate": 75,
               "emotion_distribution": {...},
               "emotion_over_time": [...],
               "teaching_insights": [...]
             }

DISPLAY Analytics Dashboard:
    ├─ Bar Chart: Emotion distribution (count per emotion)
    ├─ Pie Chart: Emotion breakdown (percentages)
    ├─ Line Chart: Positive rate over time (by frame)
    ├─ Stat Cards: Samples, dominant emotion, positive rate
    ├─ Teaching Insights: Recommendations
    └─ Export button (for future enhancement)
```

### Component Hierarchy

```
App (Router, Protected Routes)
├─ NavBar (when logged in)
│
└─ MonitorPage (Main page with tabs)
   ├─ Tab 1: Live Monitoring
   │  └─ LiveMonitoring Component
   │     ├─ useRef: videoRef, canvasRef
   │     ├─ useState: isStreaming, currentEmotion, emotionDist
   │     ├─ useEffect: cleanup on unmount
   │     ├─ Functions:
   │     │  ├─ startStream() → navigator.mediaDevices.getUserMedia()
   │     │  ├─ stopStream() → stream.getTracks().stop()
   │     │  └─ analyzeVideo() → axios.post(/frame)
   │     │
   │     └─ JSX:
   │        ├─ <video> element (videoRef)
   │        ├─ <canvas> element (canvasRef, hidden)
   │        ├─ Start/Stop buttons
   │        ├─ Emotion display card
   │        ├─ Positive rate progress bar
   │        └─ Emotion distribution chart
   │
   ├─ Tab 2: Video Upload
   │  └─ VideoUpload Component
   │     ├─ useState: file, loading, progress, result
   │     ├─ Functions:
   │     │  ├─ handleFileChange() → validate file
   │     │  ├─ handleUpload() → axios.post(/upload-video)
   │     │  └─ onAnalysisComplete callback
   │     │
   │     └─ JSX:
   │        ├─ <input type="file">
   │        ├─ File info display
   │        ├─ Progress bar
   │        ├─ Upload button
   │        └─ Result summary
   │
   └─ Tab 3: Analytics
      └─ AnalyticsDashboard Component
         ├─ Props: analysisData
         ├─ useState: analytics, loading
         ├─ useEffect: fetch analytics when data changes
         ├─ Functions:
         │  ├─ fetchAnalytics() → axios.post(/analytics)
         │
         └─ JSX:
            ├─ Summary stats (3 cards)
            ├─ Teaching insights box
            ├─ Bar chart (Recharts)
            ├─ Pie chart (Recharts)
            ├─ Line chart (Recharts)
            └─ Export button
```

---

## 🔄 State Management

```
MonitorPage State:
├─ activeTab: 'live' | 'upload' | 'analytics'
└─ analysisData: null | {frames_total, frames_analyzed, timeline}

LiveMonitoring State:
├─ isStreaming: boolean
├─ currentEmotion: string
├─ positiveRate: number
├─ faceCount: number
└─ emotionDist: {emotion: count}

VideoUpload State:
├─ file: null | File
├─ loading: boolean
├─ progress: 0-100
├─ error: null | string
└─ result: null | {frames_total, frames_analyzed}

AnalyticsDashboard State:
├─ analytics: null | {total_samples, dominant_emotion, ...}
├─ loading: boolean
└─ error: null | string
```

---

## 🗂️ Database Schema (Future)

```sql
-- Sessions (Buổi học)
CREATE TABLE sessions (
  id BIGINT PRIMARY KEY,
  teacher_id BIGINT REFERENCES users(id),
  subject VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Emotion Readings (Dữ liệu cảm xúc)
CREATE TABLE emotion_readings (
  id BIGINT PRIMARY KEY,
  session_id BIGINT REFERENCES sessions(id),
  timestamp TIMESTAMP DEFAULT NOW(),
  emotion VARCHAR(50),
  confidence FLOAT,
  face_count INT,
  image_path TEXT
);

-- Session Notes (Ghi chú buổi học)
CREATE TABLE session_notes (
  id BIGINT PRIMARY KEY,
  session_id BIGINT UNIQUE REFERENCES sessions(id),
  summary TEXT,
  notes TEXT
);

-- Session Reports (Báo cáo)
CREATE TABLE session_reports (
  id BIGINT PRIMARY KEY,
  session_id BIGINT REFERENCES sessions(id),
  file_path TEXT NOT NULL,
  exported_by BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment Architecture

```
PRODUCTION SETUP:

┌─────────────────────────────────────────────┐
│          NGINX Reverse Proxy                 │
│     (Port 80/443 - Public facing)            │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ↓                ↓
   ┌────────┐      ┌──────────┐
   │Frontend│      │ Backend  │
   │ Cont.  │      │ Cont.    │
   │Node.js │      │ Uvicorn  │
   │ :5173  │      │ :8000    │
   └────────┘      └──┬───────┘
                      │
                      ↓
            ┌──────────────────┐
            │  Docker Volume   │
            │  (Models, Data)  │
            └──────────────────┘
```

---

## 📡 API Response Timeline

```
Client Request Timeline:

t=0ms     POST /monitoring/frame
          └─ Browser sends image blob

t=10ms    Backend receives request
          └─ Decode image bytes

t=15ms    Face detection inference
          └─ YOLO on 640px image

t=25ms    Emotion detection per face (×N faces)
          └─ YOLO on 416px crops

t=40ms    Result aggregation
          └─ Compute distribution, positive rate

t=45ms    Response sent
          └─ JSON response to client

t=50ms    Frontend updates state
          └─ React re-render

t=55ms    UI animation completes
          └─ Emotion display updates

TOTAL: ~50-100ms (depending on GPU availability)
```

---

## 🔐 Security Considerations

```
Current (Development):
├─ CORS: Allow "*" (all origins)
├─ Auth: None (demo mode)
└─ HTTPS: Not used

Production (Recommended):
├─ CORS: Whitelist specific origins
├─ Auth: JWT tokens, role-based access
├─ HTTPS: Required (self-signed or Let's Encrypt)
├─ Rate limiting: Prevent abuse
├─ Input validation: File type, size, content
├─ Model security: No direct model access
└─ Data encryption: Sensitive data at rest/transit
```

---

This architecture document provides a complete picture of:

- System components and their relationships
- Data flow through the entire pipeline
- Component hierarchy and state management
- Database schema for future enhancement
- Deployment considerations
- Performance characteristics
