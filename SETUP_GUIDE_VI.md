# Phòng Học Thông Minh - Hệ Thống Giám Sát Cảm Xúc

## 🎯 Tổng Quan Dự Án

Một hệ thống toàn diện để **giám sát và phân tích cảm xúc lớp học** sử dụng các mô hình Deep Learning (YOLOv1 để nhận diện cảm xúc khuôn mặt và phát hiện khuôn mặt).

### Tính Năng Chính:

- 📹 **Giám Sát Webcam Trực Tiếp** - Nhận diện cảm xúc thời gian thực từ webcam
- 📤 **Phân Tích Upload Video** - Phân tích video đã ghi hình theo từng frame
- 📊 **Dashboard Phân Tích Tương Tác** - Trực quan hóa phân bố cảm xúc và xu hướng
- 💡 **Gợi Ý Giảng Dạy** - Đề xuất từ AI dựa trên tâm trạng lớp học
- 📈 **Dòng Thời Gian Cảm Xúc** - Theo dõi những thay đổi cảm xúc theo thời gian
- ✅ Giao diện Responsive với React + Bootstrap
- 🚀 Backend FastAPI với xử lý không đồng bộ

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────┐
│               FRONTEND (React)                      │
│  - Giám sát trực tiếp, Upload video, Phân tích    │
│  - Biểu đồ: Cột, Bánh, Đường (Recharts)          │
│  - Hiển thị nhận diện cảm xúc thời gian thực      │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓ (API REST HTTP)
┌─────────────────────────────────────────────────────┐
│          BACKEND (FastAPI + Python)                 │
│  - /monitoring/frame - Phân tích frame đơn         │
│  - /monitoring/upload-video - Phân tích video      │
│  - /monitoring/analytics - Tính toán insights      │
│  - /monitoring/health - Kiểm tra sức khỏe dịch vụ │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓ (Mô Hình Deep Learning)
┌─────────────────────────────────────────────────────┐
│   DEEP LEARNING (YOLOv1 + Xử Lý Tiền Xử Lý)       │
│  - Mô Hình Phát Hiện Khuôn Mặt (fer_YOLOv1.pt)    │
│  - Mô Hình Nhận Diện Cảm Xúc (fer_YOLOv1.pt)      │
│  - Xử Lý và Thay Đổi Kích Thước Ảnh               │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Thiết Lập Backend

### Yêu Cầu

- Python 3.10+
- CUDA 11.8+ (tùy chọn, để tăng tốc GPU)

### Cài Đặt

```bash
cd Backend

# Tạo môi trường ảo
python -m venv env

# Kích hoạt môi trường ảo
# Trên Windows:
.\env\Scripts\activate
# Trên Linux/Mac:
source env/bin/activate

# Cài đặt các thư viện
pip install -r requirements.txt
```

### Chạy Backend Server

```bash
# Từ thư mục Backend
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

Server sẽ bắt đầu tại `http://localhost:8000`

**Tài Liệu API**: Khả dụng tại `http://localhost:8000/docs` (Swagger UI)

### Các Endpoint Backend

#### 1. Phân Tích Frame Đơn Lẻ

```
POST /monitoring/frame
Content-Type: multipart/form-data

Phần thân: file (ảnh)

Phản hồi:
{
  "faces": [...],
  "emotion_distribution": {...},
  "current_emotion": "Vui",
  "positive_rate": 75
}
```

#### 2. Phân Tích Video

```
POST /monitoring/upload-video/?frame_step=5
Content-Type: multipart/form-data

Phần thân: file (video), frame_step (tùy chọn)

Phản hồi:
{
  "frames_total": 300,
  "frames_analyzed": 60,
  "timeline": [
    {
      "frame": 0,
      "current_emotion": "Vui",
      "positive_rate": 80,
      "emotion_distribution": {...}
    },
    ...
  ]
}
```

#### 3. Tính Toán Phân Tích

```
POST /monitoring/analytics

Phần thân:
{
  "timeline": [
    {"frame": 0, "current_emotion": "Vui", ...},
    ...
  ]
}

Phản hồi:
{
  "total_samples": 60,
  "dominant_emotion": "Vui",
  "positive_rate": 75,
  "emotion_distribution": {...},
  "emotion_over_time": [...],
  "teaching_insights": [...]
}
```

#### 4. Kiểm Tra Sức Khỏe Dịch Vụ

```
GET /monitoring/health

Phản hồi:
{
  "status": "healthy",
  "models_loaded": true,
  "emotion_labels": ["Vui", "Buồn", ...]
}
```

---

## 🎨 Thiết Lập Frontend

### Yêu Cầu

- Node.js 18+
- npm hoặc yarn

### Cài Đặt

```bash
cd FrontEnd

# Cài đặt các thư viện
npm install

# Khởi động Dev Server
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

### Cấu Trúc Frontend

```
FrontEnd/
├── src/
│   ├── components/
│   │   ├── monitoring/
│   │   │   ├── LiveMonitoring.jsx      # Giám sát trực tiếp
│   │   │   ├── VideoUpload.jsx         # Upload video
│   │   │   └── EmotionBarChart.jsx    # Biểu đồ cảm xúc
│   │   ├── analytics/
│   │   │   └── AnalyticsDashboard.jsx # Dashboard phân tích
│   │   └── ...
│   ├── pages/
│   │   ├── MonitorPage.jsx             # Trang giám sát
│   │   ├── AnalyticsPage.jsx           # Trang phân tích
│   │   └── ...
│   ├── config/
│   │   └── apiConfig.js                # Cấu hình API
│   ├── styles/
│   │   └── LiveMonitoring.css          # Kiểu dáng
│   └── ...
├── public/
├── package.json
└── vite.config.js
```

---

## 🚀 Hướng Dẫn Khởi Động Nhanh

### 1. Khởi Động Backend Server

```bash
cd Backend

# Windows
.\env\Scripts\activate
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000

# Linux/Mac
source env/bin/activate
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

Chờ đến khi thấy:

```
Uvicorn running on http://0.0.0.0:8000
```

### 2. Khởi Động Frontend Dev Server (Terminal Mới)

```bash
cd FrontEnd

npm run dev
```

Chờ đến khi thấy:

```
VITE v7.2.4  ready in 456 ms

➜  Local:   http://localhost:5173/
```

### 3. Mở Ứng Dụng

Mở trình duyệt: `http://localhost:5173`

### 4. Kiểm Tra Kết Nối

1. Vào trang Monitoring
2. Nhấn "Webcam" để kích hoạt camera
3. Nhấn "Start Detect"
4. Mở DevTools (F12) → Tab Network
5. Xem có request POST tới `/monitoring/frame` không?

Nếu có → Mọi thứ hoạt động tốt! ✅

---

## ⚙️ Cấu Hình

### Cấu Hình Backend (`Backend/app/server.py`)

```python
# Kích hoạt CORS cho frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Port
PORT = 8000
HOST = "0.0.0.0"
```

### Cấu Hình Frontend (`FrontEnd/src/config/apiConfig.js`)

```javascript
const API_BASE_URL = "http://localhost:8000";
export default API_BASE_URL;
```

---

## 🔐 Biến Môi Trường

Tạo file `Backend/.env`:

```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=sa
DB_PASS=sa123
DB_NAME=phantichcamxuc

# API
API_PORT=8000
API_HOST=0.0.0.0

# Models
MODEL_PATH=../../DeepLearning/models
```

---

## 📊 Cảm Xúc Được Nhận Diện

| Cảm Xúc  | Mã  | Mô Tả               |
| -------- | --- | ------------------- |
| Happy    | 😊  | Vui vẻ, mỉm cười    |
| Sad      | 😢  | Buồn, u uẩn         |
| Angry    | 😠  | Tức giận, cau mày   |
| Surprise | 😮  | Ngạc nhiên, bất ngờ |
| Neutral  | 😐  | Trung lập           |
| Disgust  | 🤢  | Ghê tởm             |
| Fear     | 😨  | Sợ hãi              |

---

## 🧪 Kiểm Tra Kết Nối

### Kiểm Tra Backend

```bash
curl -X GET http://localhost:8000/monitoring/health
```

Phản hồi dự kiến:

```json
{ "status": "healthy", "models_loaded": true }
```

### Kiểm Tra Frontend

- Mở `http://localhost:5173`
- Mở DevTools (F12)
- Tab Console không có lỗi đỏ

### Kiểm Tra API

1. Upload một ảnh (hoặc video)
2. Xem Tab Network trong DevTools
3. Request POST tới `/monitoring/frame` phải trả về status 200

---

## 🐛 Xử Lý Sự Cố

### "Cannot connect to http://localhost:8000"

**Nguyên nhân**: Backend không chạy

**Fix**:

```bash
cd Backend
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

### "Models not found"

**Nguyên nhân**: Đường dẫn mô hình sai

**Kiểm tra**:

```bash
ls DeepLearning/models/
# Phải có: face_detection.pt, fer_YOLOv1.pt
```

### "CORS error"

**Nguyên nhân**: Frontend và Backend không có CORS

**Fix**: Đảm bảo `CORSMiddleware` được thêm vào `Backend/app/server.py`

### Webcam không hoạt động

**Nguyên nhân**: Quyền truy cập không đủ

**Fix**: Cấp quyền cho browser truy cập camera

---

## 📝 Tài Liệu Thêm

- **UPLOAD_VIDEO_GUIDE.md** - Hướng dẫn upload video chi tiết
- **DEBUG_GUIDE.md** - Hướng dẫn debug vấn đề
- **TESTING_GUIDE.md** - Hướng dẫn test đầy đủ
- **LIVE_MONITORING_GUIDE.md** - Hướng dẫn giám sát trực tiếp

---

**Phiên bản**: 2.0  
**Cập nhật**: 2024-11-26  
**Ngôn ngữ**: Tiếng Việt
