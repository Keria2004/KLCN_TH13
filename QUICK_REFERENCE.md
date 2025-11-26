# ⚡ Quick Reference Card

## 🚀 3-Step Startup

```bash
# STEP 1: Backend (Terminal 1)
cd Backend
.\env\Scripts\activate
uvicorn app.server:app --reload

# STEP 2: Frontend (Terminal 2)
cd FrontEnd
npm run dev

# STEP 3: Browser
http://localhost:5173
```

---

## 📡 API Endpoints

```
GET  /monitoring/health
     └─ Check service status

POST /monitoring/frame
     ├─ Input: image file
     └─ Output: {faces[], emotion, positive_rate}

POST /monitoring/upload-video/
     ├─ Input: video file, frame_step
     └─ Output: {frames_total, timeline[]}

POST /monitoring/analytics
     ├─ Input: timeline[]
     └─ Output: {insights, charts data}
```

**Full Docs**: http://localhost:8000/docs

---

## 🎨 Emotion Colors

| Emotion  | Color  | Emoji |
| -------- | ------ | ----- |
| Happy    | Green  | 😄    |
| Surprise | Amber  | 😲    |
| Neutral  | Gray   | 😐    |
| Sad      | Blue   | 😢    |
| Angry    | Red    | 😡    |
| Disgust  | Pink   | 😖    |
| Fear     | Orange | 😨    |

---

## 📂 Key Files

**Frontend** (React)

- `FrontEnd/src/components/monitoring/LiveMonitoring.jsx`
- `FrontEnd/src/components/monitoring/VideoUpload.jsx`
- `FrontEnd/src/components/analytics/AnalyticsDashboard.jsx`
- `FrontEnd/src/pages/MonitorPage.jsx`

**Backend** (FastAPI)

- `Backend/app/routers/monitoring_router.py`
- `Backend/app/service/emotion_service.py`
- `Backend/app/service/ai_service.py`
- `Backend/app/server.py`

**Config**

- `FrontEnd/src/config/apiConfig.js` (API URL)
- `Backend/app/server.py` (CORS settings)

---

## 🔧 Configuration

```javascript
// API Base URL (FrontEnd)
const API_BASE_URL = "http://localhost:8000";

// CORS (Backend)
allow_origins = ["*"]; // Change in production

// Ports
Frontend: localhost: 5173;
Backend: localhost: 8000;
```

---

## 📊 Component Structure

```
MonitorPage
├─ LiveMonitoring (Tab 1)
│  └─ Real-time webcam analysis
├─ VideoUpload (Tab 2)
│  └─ Upload & analyze video
└─ AnalyticsDashboard (Tab 3)
   ├─ Bar chart (emotion distribution)
   ├─ Pie chart (emotion breakdown)
   ├─ Line chart (positive rate over time)
   └─ Teaching insights
```

---

## 💾 Installation Shortcuts

```bash
# Backend dependencies
pip install -r Backend/requirements.txt

# Frontend dependencies
npm install --prefix FrontEnd

# Run both (separate terminals)
cd Backend && uvicorn app.server:app --reload
cd FrontEnd && npm run dev
```

---

## 🐛 Common Issues & Fixes

| Problem          | Solution                        |
| ---------------- | ------------------------------- |
| Port 8000 in use | `--port 8001`                   |
| Camera denied    | Check browser permissions       |
| CORS error       | Backend CORS is open            |
| Models not found | Place in `DeepLearning/models/` |
| npm not found    | Install Node.js                 |
| Python not found | Install Python 3.10+            |

---

## 📈 Positive Rate Formula

```
Positive Rate = (Happy + Surprise) / Total Faces × 100%
```

**Example:**

- 10 faces detected
- 2 are Happy
- 3 are Surprise
- Positive Rate = (2+3)/10 × 100% = **50%**

---

## 🎯 Feature Checklist

✅ Real-time emotion detection  
✅ Video analysis with timeline  
✅ Interactive analytics charts  
✅ Teaching insights/recommendations  
✅ Emotion distribution tracking  
✅ Responsive UI design  
✅ API documentation (Swagger)  
✅ Docker support  
✅ Multi-emotion recognition (7 types)  
✅ Error handling

---

## 📱 Browser Support

✅ Chrome/Edge (Best)  
✅ Firefox  
✅ Safari (Limited)  
❌ Internet Explorer

_Note: Camera requires HTTPS in production or localhost in dev_

---

## 🔐 Default Credentials

```
Username: any
Password: any

(Demo mode - accepts everything)
```

---

## 📊 Data Persistence

**Current**: ❌ No database (in-memory only)  
**Future**: ✅ PostgreSQL with SQLAlchemy

---

## 🐳 Docker Quick Start

```bash
docker-compose up

# Then visit
http://localhost:5173
```

---

## 📚 Documentation Map

```
🌟 START HERE
   ↓
QUICKSTART.md (3 steps)
   ↓
┌─────────────────────────────┐
├─ Setup issues?   → SETUP_GUIDE.md
├─ Want details?   → ARCHITECTURE.md
├─ See what built? → BUILD_SUMMARY.md
└─ Need index?     → INDEX.md
```

---

## ⚙️ Tech Stack

**Frontend**: React 19 + Recharts + Bootstrap + Vite  
**Backend**: FastAPI + Uvicorn + OpenCV  
**Models**: YOLOv1 (PyTorch) + TensorFlow  
**Deploy**: Docker + Docker Compose

---

## 🎓 Key Concepts

```
Live Monitoring:
User → Webcam → Frame → /monitoring/frame → Display

Video Analysis:
Video → Extract Frames → /monitoring/upload-video → Timeline

Analytics:
Timeline → /monitoring/analytics → Insights + Charts
```

---

## 📞 Quick Help

- **API Issues**: Check http://localhost:8000/docs
- **Frontend Issues**: Press F12 (browser console)
- **Backend Issues**: Check terminal output
- **Setup Issues**: Read SETUP_GUIDE.md

---

## 🎉 You're Ready!

Run these 3 commands:

```bash
cd Backend && uvicorn app.server:app --reload
cd FrontEnd && npm run dev
open http://localhost:5173
```

**That's it! 🚀**

---

## 📝 Notes

- Emotion detection: ~50-100ms per frame
- Video analysis: ~1-2min per minute of video
- Supported formats: MP4, AVI, MOV
- Max file size: 500MB
- Model inference: GPU recommended but CPU works

---

**Version**: 1.0.0 | **Updated**: Nov 26, 2025 | **Status**: ✅ Ready
