# 🎓 Smart Classroom - Emotion Monitoring System

**Hệ thống Giám sát và Phân tích Cảm xúc Lớp học**

A complete system for monitoring and analyzing classroom emotions using Deep Learning (facial emotion recognition).

---

## 🚀 Quick Start (3 Steps)

### Step 1: Setup Backend

```bash
cd Backend
python -m venv env
.\env\Scripts\activate           # Windows
# source env/bin/activate         # Linux/Mac
pip install -r requirements.txt
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Setup Frontend (New Terminal)

```bash
cd FrontEnd
npm install
npm run dev
```

### Step 3: Open Browser

```
http://localhost:5173
```

---

## ✨ What's New in This Build

### ✅ Frontend Components

- **LiveMonitoring.jsx** - Real-time webcam emotion detection
- **VideoUpload.jsx** - Upload and analyze video files
- **AnalyticsDashboard.jsx** - Interactive charts and insights
- **Responsive CSS** - Mobile-friendly styling

### ✅ Backend Endpoints

- `POST /monitoring/frame` - Single image analysis
- `POST /monitoring/upload-video/` - Video analysis
- `POST /monitoring/analytics` - Compute insights
- `GET /monitoring/health` - Health check

### ✅ Features

📹 Live camera monitoring with real-time emotion detection  
📤 Video upload and frame-by-frame analysis  
📊 Interactive charts (Bar, Pie, Line)  
💡 AI-generated teaching insights  
📈 Emotion distribution and timeline tracking  
✅ Responsive Bootstrap UI

---

## 📁 Updated Files

```
✨ NEW FILES:
├── FrontEnd/src/components/monitoring/
│   ├── LiveMonitoring.jsx         [Real-time detection]
│   └── VideoUpload.jsx            [Video upload]
├── FrontEnd/src/components/analytics/
│   └── AnalyticsDashboard.jsx     [Charts & insights]
├── FrontEnd/src/styles/
│   ├── LiveMonitoring.css
│   ├── VideoUpload.css
│   └── AnalyticsDashboard.css
├── SETUP_GUIDE.md                 [Comprehensive guide]
├── BUILD_SUMMARY.md               [Project summary]
├── setup.py                       [Auto setup script]
├── Dockerfile                     [Backend container]
├── docker-compose.yml             [Multi-container setup]
└── FrontEnd/Dockerfile.frontend   [Frontend container]

🔄 UPDATED FILES:
├── Backend/requirements.txt       [Added all dependencies]
├── Backend/app/routers/monitoring_router.py [New endpoints]
└── FrontEnd/src/pages/MonitorPage.jsx [Tabbed interface]
```

---

## 🎯 Features Explained

### Live Monitoring

- Start webcam stream
- Real-time emotion detection (500ms intervals)
- Display current emotion with color coding
- Show positive rate percentage
- Track detected faces count
- Live emotion distribution chart

### Video Analysis

- Upload MP4, AVI, or MOV files
- Frame-by-frame analysis (configurable step)
- Timeline of emotions over video duration
- Emotion statistics

### Analytics Dashboard

- **Bar Chart** - Emotion distribution (count)
- **Pie Chart** - Emotion breakdown (percentages)
- **Line Chart** - Positive rate over time
- **Summary Stats** - Total samples, dominant emotion, positive rate
- **Teaching Insights** - Recommendations based on sentiment

---

## 🎨 Emotion Categories

| Emoji | Emotion  | Type     | Color  |
| ----- | -------- | -------- | ------ |
| 😄    | Happy    | Positive | Green  |
| 😲    | Surprise | Positive | Amber  |
| 😐    | Neutral  | Neutral  | Gray   |
| 😢    | Sad      | Negative | Blue   |
| 😡    | Angry    | Negative | Red    |
| 😖    | Disgust  | Negative | Pink   |
| 😨    | Fear     | Negative | Orange |

**Positive Rate** = (Happy + Surprise) / Total × 100%

---

## 📊 API Quick Reference

### Frame Analysis

```bash
curl -X POST http://localhost:8000/monitoring/frame \
  -F "file=@image.jpg"
```

### Video Analysis

```bash
curl -X POST http://localhost:8000/monitoring/upload-video/ \
  -F "file=@video.mp4" \
  -F "frame_step=5"
```

### Health Check

```bash
curl http://localhost:8000/monitoring/health
```

Full API docs: `http://localhost:8000/docs`

---

## ⚙️ Configuration

### Backend (`Backend/app/server.py`)

- CORS enabled for all origins (change in production)
- Server runs on `0.0.0.0:8000`

### Frontend (`FrontEnd/src/config/apiConfig.js`)

```javascript
const API_BASE_URL = "http://localhost:8000";
```

---

## 🐛 Troubleshooting

**Q: Camera doesn't work**  
A: Check browser permissions, use Chrome/Edge, must be localhost or HTTPS

**Q: "Cannot find models"**  
A: Ensure DeepLearning/models/ has all required .pt files

**Q: CORS errors**  
A: Backend CORS is configured for "\*", check backend is running

**Q: "Cannot decode video"**  
A: Use MP4/AVI/MOV format, check file size < 500MB

**Q: Port 8000/5173 already in use**  
A: Change port in command: `--port 8001`

---

## 📖 Full Documentation

See **SETUP_GUIDE.md** for:

- Detailed architecture overview
- Complete API documentation
- Database models and schemas
- Deployment options
- Learning resources
- Advanced configuration

See **BUILD_SUMMARY.md** for:

- Complete project build summary
- Technical stack details
- File structure
- Testing checklist
- Future enhancements

---

## 🔧 Tech Stack

**Frontend:**

- React 19.2.0
- React Router 7.9.6
- Recharts 3.5.0
- Axios 1.13.2
- Bootstrap 5.3.8
- Vite 7.2.4

**Backend:**

- FastAPI 0.104.1
- Uvicorn 0.24.0
- Ultralytics YOLOv1 8.0.228
- OpenCV 4.8.1.78
- PyTorch 2.1.0
- TensorFlow 2.14.0

---

## 📦 Installation Options

### Option 1: Manual Setup (Recommended)

```bash
# Backend
cd Backend
python -m venv env
.\env\Scripts\activate
pip install -r requirements.txt
uvicorn app.server:app --reload

# Frontend (new terminal)
cd FrontEnd
npm install
npm run dev
```

### Option 2: Automated Setup

```bash
python setup.py
# Follow interactive prompts
```

### Option 3: Docker

```bash
docker-compose up
```

---

## ✅ Pre-requisites

- **Python 3.10+** (Backend)
- **Node.js 16+** (Frontend)
- **GPU (optional)** - For faster emotion detection
- **Deep Learning Models** - Place in `DeepLearning/models/`
  - `face_detection.pt`
  - `fer_YOLOv1.pt`
  - `fer2013_mini_XCEPTION.102-0.66.hdf5`

---

## 🌐 Browser Support

✅ Chrome/Edge (Recommended)  
✅ Firefox  
✅ Safari (limited WebRTC support)  
❌ Internet Explorer

Note: Camera access requires HTTPS in production or localhost in development.

---

## 📱 Responsive Design

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

---

## 🎓 Learning Path

1. **Start**: Run the app locally
2. **Explore**: Use Live Monitoring tab
3. **Upload**: Try with a class video
4. **Analyze**: Check Analytics dashboard
5. **Customize**: Modify emotions or insights logic
6. **Deploy**: Use Docker for production

---

## 🤝 Contributing

This is a demo/educational project for KLCN_TH13. To extend:

1. Add database models (e.g., PostgreSQL)
2. Implement real authentication
3. Add session history
4. Create advanced analytics
5. Build mobile app

---

## 📝 Notes

- This is a **demo system** for proof-of-concept
- Currently **single-session** (no persistence)
- **Demo authentication** (accepts any credentials)
- All emotions are detected **without storage**
- Ready for **production enhancement**

---

## 🆘 Support & Issues

1. **Check SETUP_GUIDE.md** - Most issues covered
2. **Browser Console** - Press F12 for errors
3. **Backend Logs** - Check terminal output
4. **API Docs** - http://localhost:8000/docs
5. **Code Comments** - Well-documented inline

---

## 📄 License

Educational Project - KLCN_TH13

---

## 🎉 You're All Set!

**Happy emotion monitoring! 👍**

Start with: `npm run dev` (Frontend) + `uvicorn app.server:app --reload` (Backend)

Then visit: `http://localhost:5173`

---

**Last Updated**: November 26, 2025  
**Version**: 1.0.0
