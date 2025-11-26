# Smart Classroom - Emotion Monitoring System

## 🎯 Project Overview

A comprehensive system for **monitoring and analyzing classroom emotions** using Deep Learning models (YOLOv1 for Facial Emotion Recognition and Face Detection).

### Key Features:

- 📹 **Live Camera Monitoring** - Real-time emotion detection from webcam
- 📤 **Video Upload Analysis** - Analyze pre-recorded videos frame-by-frame
- 📊 **Interactive Analytics Dashboard** - Visualize emotion distribution and trends
- 💡 **Teaching Insights** - AI-generated suggestions based on class sentiment
- 📈 **Emotion Timeline** - Track emotional changes over time
- ✅ Responsive UI with React + Bootstrap
- 🚀 FastAPI backend with async processing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                  │
│  - Live Monitoring, Video Upload, Analytics        │
│  - Charts: Bar, Pie, Line (Recharts)               │
│  - Real-time emotion detection display             │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓ (HTTP REST API)
┌─────────────────────────────────────────────────────┐
│              BACKEND (FastAPI + Python)             │
│  - /monitoring/frame - Single frame analysis       │
│  - /monitoring/upload-video - Video analysis       │
│  - /monitoring/analytics - Compute insights        │
│  - /monitoring/health - Service health check       │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓ (Deep Learning Models)
┌─────────────────────────────────────────────────────┐
│      DEEP LEARNING (YOLOv1 + Preprocessing)        │
│  - Face Detection Model (fer_YOLOv1.pt)            │
│  - Emotion Recognition (fer_YOLOv1.pt)             │
│  - Image Preprocessing & Resizing                  │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Backend Setup

### Requirements

- Python 3.10+
- CUDA 11.8+ (optional, for GPU acceleration)

### Installation

```bash
cd Backend

# Create virtual environment
python -m venv env

# Activate virtual environment
# On Windows:
.\env\Scripts\activate
# On Linux/Mac:
source env/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running Backend Server

```bash
# From Backend directory
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

**API Documentation**: Available at `http://localhost:8000/docs` (Swagger UI)

### Backend Endpoints

#### 1. Single Frame Analysis

```
POST /monitoring/frame
Content-Type: multipart/form-data

Body: file (image)

Response:
{
  "faces": [...],
  "emotion_distribution": {...},
  "current_emotion": "Happy",
  "positive_rate": 75
}
```

#### 2. Video Analysis

```
POST /monitoring/upload-video/?frame_step=5
Content-Type: multipart/form-data

Body: file (video), frame_step (optional)

Response:
{
  "frames_total": 300,
  "frames_analyzed": 60,
  "timeline": [
    {
      "frame": 0,
      "current_emotion": "Happy",
      "positive_rate": 80,
      "emotion_distribution": {...}
    },
    ...
  ]
}
```

#### 3. Analytics Computation

```
POST /monitoring/analytics

Body:
{
  "timeline": [
    {"frame": 0, "current_emotion": "Happy", ...},
    ...
  ]
}

Response:
{
  "total_samples": 60,
  "dominant_emotion": "Happy",
  "positive_rate": 75,
  "emotion_distribution": {...},
  "emotion_over_time": [...],
  "teaching_insights": [...]
}
```

#### 4. Health Check

```
GET /monitoring/health

Response:
{
  "status": "healthy",
  "timestamp": "2025-11-26T...",
  "service": "emotion_monitoring"
}
```

---

## 🎨 Frontend Setup

### Requirements

- Node.js 16+
- npm or yarn

### Installation

```bash
cd FrontEnd

# Install dependencies
npm install

# For development
npm run dev

# For production build
npm run build
```

Frontend runs at `http://localhost:5173` (Vite default)

### Frontend Structure

```
src/
├── components/
│   ├── monitoring/
│   │   ├── LiveMonitoring.jsx      # Real-time webcam monitoring
│   │   └── VideoUpload.jsx         # Video file upload & analysis
│   └── analytics/
│       └── AnalyticsDashboard.jsx  # Charts and insights
├── pages/
│   ├── HomePage.jsx                # Dashboard homepage
│   ├── MonitorPage.jsx             # Main monitoring page
│   ├── AnalyticsPage.jsx           # Analytics view
│   ├── ReportPage.jsx              # Reports
│   └── LoginPage.jsx               # Authentication
├── styles/
│   ├── LiveMonitoring.css
│   ├── VideoUpload.css
│   └── AnalyticsDashboard.css
├── config/
│   └── apiConfig.js                # API base URL
└── App.jsx                         # Main app with routing
```

---

## 🚀 Quick Start Guide

### 1. Start Backend Server

```bash
cd Backend
.\env\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend Dev Server (in another terminal)

```bash
cd FrontEnd
npm install
npm run dev
```

### 3. Open Browser

Navigate to `http://localhost:5173`

### 4. Try the Application

1. **Login**: Use dummy credentials (system accepts any login for demo)
2. **Live Monitoring**: Start webcam feed and watch real-time emotion detection
3. **Upload Video**: Select a video file and analyze it for emotion distribution
4. **Analytics**: View charts showing emotion patterns and insights

---

## 🎯 Emotion Categories

The system recognizes 7 emotions:

| Emoji | Emotion  | Classification |
| ----- | -------- | -------------- |
| 😄    | Happy    | Positive       |
| 😲    | Surprise | Positive       |
| 😐    | Neutral  | Neutral        |
| 😢    | Sad      | Negative       |
| 😡    | Angry    | Negative       |
| 😖    | Disgust  | Negative       |
| 😨    | Fear     | Negative       |

**Positive Rate** = (Happy + Surprise counts) / Total faces × 100%

---

## 📊 Data Flow

### Live Monitoring Flow:

```
1. Start Webcam Stream
2. Capture frame every 500ms
3. Convert to image blob
4. POST to /monitoring/frame
5. Receive emotion data
6. Update UI in real-time
7. Display current emotion, positive rate, face count
```

### Video Analysis Flow:

```
1. Select video file
2. Validate file type & size
3. POST to /monitoring/upload-video/?frame_step=5
4. Server extracts frames every 5th frame
5. Analyze each frame with emotion model
6. Return complete timeline
7. POST timeline to /monitoring/analytics
8. Generate charts and insights
```

---

## 🔧 Configuration

### Backend Configuration (`Backend/app/server.py`)

```python
# CORS Settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["http://localhost:5173"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend Configuration (`FrontEnd/src/config/apiConfig.js`)

```javascript
const API_BASE_URL = "http://localhost:8000";
export default API_BASE_URL;
```

---

## 🐛 Troubleshooting

### Issue: Camera not working

**Solution**:

- Check browser permissions for camera access
- Try in HTTPS or localhost
- Use Chrome/Edge browsers for best compatibility

### Issue: Video upload fails

**Solution**:

- Ensure video format is MP4, AVI, or MOV
- Check file size (max 500MB)
- Ensure backend is running and accessible

### Issue: "Cannot find emotion models"

**Solution**:

- Verify models exist in `DeepLearning/models/`
- Required files:
  - `face_detection.pt`
  - `fer_YOLOv1.pt`
  - `fer2013_mini_XCEPTION.102-0.66.hdf5`

### Issue: CORS errors

**Solution**:

- Backend CORS is set to allow "\*"
- Ensure backend URL in frontend config matches running server
- Check both servers are running

---

## 📝 API Response Examples

### Emotion Distribution

```json
{
  "Anger": 2,
  "Disgust": 1,
  "Fear": 0,
  "Happy": 15,
  "Neutral": 8,
  "Sad": 3,
  "Surprise": 1
}
```

### Teaching Insights

```json
{
  "teaching_insights": [
    "✅ Lớp rất hứng thú - Tiếp tục phương pháp hiện tại!",
    "👍 Sự hứng thú: 78%",
    "💡 Gợi ý: Tăng cường tương tác để duy trì sự tập trung"
  ]
}
```

---

## 📦 Dependencies

### Frontend

- **React 19.2.0** - UI framework
- **React Router 7.9.6** - Navigation
- **Recharts 3.5.0** - Charts visualization
- **Axios 1.13.2** - HTTP client
- **Bootstrap 5.3.8** - UI components
- **TailwindCSS 4.1.17** - Utility CSS

### Backend

- **FastAPI 0.104.1** - Web framework
- **Uvicorn 0.24.0** - ASGI server
- **Ultralytics 8.0.228** - YOLOv1 models
- **OpenCV 4.8.1.78** - Image processing
- **NumPy 1.24.3** - Numerical computing
- **TensorFlow 2.14.0** - Deep learning
- **PyTorch 2.1.0** - Deep learning

---

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Recharts Documentation](https://recharts.org/)
- [Ultralytics YOLOv1](https://github.com/ultralytics/yolov1)
- [OpenCV Documentation](https://docs.opencv.org/)

---

## 📄 License

Educational Project - KLCN_TH13

---

## 👥 Support

For issues or questions, please check:

1. Backend logs in terminal
2. Browser console (F12)
3. FastAPI Swagger UI at `/docs`

---

**Version**: 1.0.0  
**Last Updated**: November 26, 2025
