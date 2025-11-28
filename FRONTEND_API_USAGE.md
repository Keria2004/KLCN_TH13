# 🎯 Frontend API Usage - Hệ Thống Giám Sát Cảm Xúc

Tài liệu này liệt kê **tất cả các API được gọi từ Frontend** và vị trí sử dụng.

---

## 📍 Tóm Tắt API Được Sử Dụng

| #   | API                                  | Method | Component          | Mục Đích                  |
| --- | ------------------------------------ | ------ | ------------------ | ------------------------- |
| 1   | `/sessions/recent`                   | GET    | HomePage           | Lấy buổi học gần đây      |
| 2   | `/sessions/create`                   | POST   | HomePage           | Tạo buổi học mới          |
| 3   | `/monitoring/frame`                  | POST   | LiveMonitoring     | Phân tích 1 frame         |
| 4   | `/sessions/end_session`              | POST   | LiveMonitoring     | Kết thúc buổi học         |
| 5   | `/monitoring/upload-video/`          | POST   | VideoUpload        | Tải lên & phân tích video |
| 6   | `/monitoring/analytics`              | POST   | AnalyticsDashboard | Lấy thống kê chi tiết     |
| 7   | `/sessions/recent_classes`           | GET    | AnalyticsPage      | Lấy danh sách lớp học     |
| 8   | `/sessions/{session_id}`             | GET    | AnalyticsPage      | Lấy chi tiết buổi học     |
| 9   | `/sessions/recent_classes?limit=100` | GET    | ReportPage         | Lấy buổi học cho báo cáo  |

---

## 📄 Chi Tiết Từng API

### 1. Get Recent Sessions

**File:** `FrontEnd/src/pages/HomePage.jsx` (Line 19)  
**Endpoint:** `GET /sessions/recent`

```javascript
const res = await fetch(`${API_BASE_URL}/sessions/recent`);
if (!res.ok) throw new Error("Failed to load");
const data = await res.json();
```

**Sử dụng:** Hiển thị danh sách buổi học gần đây trên trang chủ  
**Trigger:** useEffect khi component mount

---

### 2. Create Session

**File:** `FrontEnd/src/pages/HomePage.jsx` (Line 68)  
**Endpoint:** `POST /sessions/create`

```javascript
const res = await fetch(`${API_BASE_URL}/sessions/create`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
  body: JSON.stringify({
    subject: subject,
    teacher_id: parseInt(currentTeacherId),
  }),
});
```

**Sử dụng:** Tạo buổi học mới khi bắt đầu giám sát  
**Trigger:** Khi user click "Bắt đầu buổi học"  
**Dữ liệu gửi:**

- `subject` (string): Tên môn học
- `teacher_id` (int): ID giáo viên

---

### 3. Detect Frame (Emotion Analysis)

**File:** `FrontEnd/src/components/monitoring/LiveMonitoring.jsx` (Line 181)  
**Endpoint:** `POST /monitoring/frame`

```javascript
const response = await axios.post(
  `${API_BASE_URL}/monitoring/frame`,
  formData,
  {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 10000,
  }
);
```

**Sử dụng:** Phân tích cảm xúc từ từng frame webcam/video  
**Trigger:** Mỗi 300-500ms (tùy stream mode)  
**Dữ liệu gửi:**

- `file` (blob): Frame ảnh (JPEG 95% quality)

**Dữ liệu nhận:**

```json
{
  "current_emotion": "Happy",
  "positive_rate": 78.5,
  "faces": [...],
  "emotion_distribution": {...}
}
```

---

### 4. End Session

**File:** `FrontEnd/src/components/monitoring/LiveMonitoring.jsx` (Line 322)  
**Endpoint:** `POST /sessions/end_session`

```javascript
const response = await axios.post(
  `${API_BASE_URL}/sessions/end_session`,
  sessionData,
  { timeout: 10000 }
);
```

**Sử dụng:** Kết thúc buổi học và lưu dữ liệu cảm xúc  
**Trigger:** Khi user click "Kết thúc buổi học"

**Dữ liệu gửi:**

```json
{
  "session_id": "session_5",
  "subject": "Toán Học",
  "start_time": "2024-11-28T14:00:00",
  "end_time": "2024-11-28T14:45:00",
  "duration": 2700,
  "total_frames": 100,
  "emotion_counts": {
    "Happy": 45,
    "Neutral": 30,
    "Sad": 10,
    "Angry": 5,
    "Surprise": 8,
    "Disgust": 1,
    "Fear": 1
  },
  "timeline": [...]
}
```

---

### 5. Upload Video

**File:** `FrontEnd/src/components/monitoring/VideoUpload.jsx` (Line 50)  
**Endpoint:** `POST /monitoring/upload-video/`

```javascript
const response = await axios.post(
  `${API_BASE_URL}/monitoring/upload-video/`,
  formData,
  {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setUploadProgress(percent);
    },
  }
);
```

**Sử dụng:** Tải lên video và phân tích cảm xúc cho từng frame  
**Trigger:** Khi user chọn file video và click "Phân tích"

**Dữ liệu gửi:**

- `file` (File): Video file (MP4, AVI, MOV...)
- `frame_step` (int): 5 (phân tích mỗi 5 frame)

**Dữ liệu nhận:**

```json
{
  "frames_total": 1000,
  "frames_analyzed": 200,
  "timeline": [...]
}
```

---

### 6. Get Analytics

**File:** `FrontEnd/src/components/analytics/AnalyticsDashboard.jsx` (Line 48)  
**Endpoint:** `POST /monitoring/analytics`

```javascript
const response = await axios.post(`${API_BASE_URL}/monitoring/analytics`, {
  timeline: data.timeline,
});
```

**Sử dụng:** Lấy thống kê chi tiết từ timeline dữ liệu cảm xúc  
**Trigger:** Khi component nhận dữ liệu timeline

**Dữ liệu nhận:**

```json
{
  "total_samples": 100,
  "dominant_emotion": "Happy",
  "positive_rate": 75,
  "emotion_distribution": {...},
  "emotion_over_time": [...],
  "teaching_insights": [...]
}
```

---

### 7. Get Recent Classes

**File:** `FrontEnd/src/pages/AnalyticsPage.jsx` (Line 98)  
**Endpoint:** `GET /sessions/recent_classes`

```javascript
const response = await axios.get(`${API_BASE_URL}/sessions/recent_classes`);
```

**Sử dụng:** Lấy danh sách lớp học gần đây để hiển thị trên Analytics  
**Trigger:** useEffect khi component mount  
**Query params:** Không có (hoặc `limit=10`)

---

### 8. Get Session Details

**File:** `FrontEnd/src/pages/AnalyticsPage.jsx` (Line 118)  
**Endpoint:** `GET /sessions/{session_id}`

```javascript
const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}`);
const session = response.data;
```

**Sử dụng:** Lấy chi tiết của 1 buổi học cụ thể để hiển thị charts  
**Trigger:** Khi user chọn 1 buổi học từ danh sách

**Dữ liệu nhận:**

```json
{
  "status": "success",
  "id": 5,
  "subject": "Toán Học",
  "teacher_id": 1,
  "created_at": "2024-11-28T14:00:00",
  "ended_at": "2024-11-28T14:45:00",
  "dominant_emotion": "Happy",
  "positive_rate": 75.5,
  "emotion_summary": {...},
  "status": "ended"
}
```

---

### 9. Get Sessions for Report

**File:** `FrontEnd/src/pages/ReportPage.jsx` (Line 21)  
**Endpoint:** `GET /sessions/recent_classes?limit=100`

```javascript
const response = await axios.get(
  `${API_BASE_URL}/sessions/recent_classes?limit=100`
);
```

**Sử dụng:** Lấy danh sách buổi học để generate báo cáo  
**Trigger:** useEffect khi component mount

---

## 🔄 Flow Ví Dụ

### Flow 1: Giám Sát Trực Tiếp (Webcam)

```
HomePage: POST /sessions/create
    ↓
LiveMonitoring: POST /monitoring/frame (lặp ~100-200 lần, mỗi 300-500ms)
    ↓
MonitorPage: POST /monitoring/analytics (optional, xử lý real-time stats)
    ↓
LiveMonitoring: POST /sessions/end_session
    ↓
LiveMonitoring: GET /sessions/recent_classes (reload danh sách)
    ↓
Lưu vào localStorage (lastSessionData, sessionsList)
    ↓
Redirect → AnalyticsPage
    ↓
AnalyticsPage: Load từ localStorage (tự động hiển thị session vừa lưu)
```

### Flow 2: Tải Lên Video

```
VideoUpload: POST /monitoring/upload-video/
    ↓
AnalyticsDashboard: POST /monitoring/analytics
    ↓
(Optional) POST /sessions/end_session
    ↓
(Optional) GET /sessions/recent_classes (reload danh sách)
    ↓
AnalyticsPage: Hiển thị dữ liệu phân tích
```

### Flow 3: Xem Báo Cáo

```
ReportPage: GET /sessions/recent_classes?limit=100
    ↓
ReportPage: Generate PDF từ dữ liệu
    ↓
(Download hoặc Print)
```

---

## 🛠️ Error Handling

**Các xử lý lỗi phổ biến:**

### 1. Network Error

```javascript
try {
  const response = await axios.post(API_URL, data);
} catch (error) {
  if (error.response?.status === 400) {
    // Bad request
  } else if (error.response?.status === 401) {
    // Unauthorized
  } else if (error.code === "ECONNABORTED") {
    // Timeout
  }
}
```

### 2. Video Upload Error

```javascript
try {
  const response = await axios.post(API_URL, formData);
} catch (error) {
  if (error.message.includes("Network Error")) {
    setError("Lỗi kết nối - Kiểm tra đường truyền");
  } else if (error.response?.status === 400) {
    setError("Video không hợp lệ hoặc định dạng không được hỗ trợ");
  }
}
```

---

## 📊 Performance Notes

| API                         | Frequency        | Timeout | Size             |
| --------------------------- | ---------------- | ------- | ---------------- |
| `/monitoring/frame`         | ~2-3 FPS         | 10s     | 50-200KB         |
| `/monitoring/upload-video/` | 1x per video     | 60s+    | 10-500MB         |
| `/monitoring/analytics`     | On demand        | 10s     | Response < 1MB   |
| `/sessions/recent_classes`  | 1x per page load | 5s      | Response < 1MB   |
| `/sessions/{session_id}`    | On demand        | 5s      | Response < 100KB |

---

## 🔐 Authentication

**Hiện tại:** Không bắt buộc, nhưng hỗ trợ token

```javascript
// Với token
const token = localStorage.getItem("token");
const headers = {
  Authorization: token ? `Bearer ${token}` : "",
};
```

---

## 🎯 Các Trang Sử Dụng API

### HomePage (`FrontEnd/src/pages/HomePage.jsx`)

- GET `/sessions/recent` - Tải buổi học gần đây
- POST `/sessions/create` - Tạo buổi học mới

### MonitorPage (`FrontEnd/src/pages/MonitorPage.jsx`)

- Gọi qua LiveMonitoring & VideoUpload components
- **🔔 Chức năng mới:** Thông báo khi tỷ lệ chán nản ≥ 40%

### LiveMonitoring (`FrontEnd/src/components/monitoring/LiveMonitoring.jsx`)

- POST `/monitoring/frame` - Liên tục khi detect
- POST `/sessions/end_session` - Kết thúc buổi học

### VideoUpload (`FrontEnd/src/components/monitoring/VideoUpload.jsx`)

- POST `/monitoring/upload-video/` - Tải video

### AnalyticsDashboard (`FrontEnd/src/components/analytics/AnalyticsDashboard.jsx`)

- POST `/monitoring/analytics` - Phân tích timeline

### AnalyticsPage (`FrontEnd/src/pages/AnalyticsPage.jsx`)

- GET `/sessions/recent_classes` - Lấy danh sách
- GET `/sessions/{session_id}` - Lấy chi tiết

### ReportPage (`FrontEnd/src/pages/ReportPage.jsx`)

- GET `/sessions/recent_classes?limit=100` - Lấy tất cả buổi học

---

## 🔔 Chức Năng Thông Báo Chán Nản

### Mô Tả

Hệ thống tự động hiển thị **cảnh báo** khi tỷ lệ học sinh chán nản vượt quá **40%**.

### Tỷ Lệ Chán Nản Được Tính Như Thế Nào?

```
Bored Rate = (Sad + Angry + Disgust + Fear) / Total Frames * 100
```

**Ví dụ:**

- Nếu có 100 frame: 15 Sad + 10 Angry + 3 Disgust + 2 Fear = 30 frame tiêu cực
- Tỷ lệ = (30 / 100) \* 100 = **30%** → Không cảnh báo

- Nếu có 100 frame: 25 Sad + 12 Angry + 5 Disgust + 3 Fear = 45 frame tiêu cực
- Tỷ lệ = (45 / 100) \* 100 = **45%** → ⚠️ **Hiển thị cảnh báo**

### Nơi Hiển Thị Alert

**File:** `FrontEnd/src/pages/MonitorPage.jsx`

- Hiển thị ở **góc trên phải** màn hình
- Mầu: Gradient cam (#ff9800 → #f57c00)
- Có icon ⚠️ cảnh báo

### Kích Hoạt

- Khi giám sát trực tiếp (LiveMonitoring)
- Khi tải lên video (VideoUpload)
- Real-time cập nhật khi tỷ lệ thay đổi

### Code Triển Khai

```javascript
// MonitorPage.jsx - Tính toán tỷ lệ chán nản
const calculateBoredRate = (data) => {
  if (!data || data.length === 0) return 0;
  const total = data.reduce((a, b) => a + b, 0) || 1;
  // data[1] = Sad, data[2] = Angry, data[5] = Disgust, data[6] = Fear
  const boredEmotions =
    (data[1] || 0) + (data[2] || 0) + (data[5] || 0) + (data[6] || 0);
  return Math.round((boredEmotions / total) * 100);
};

// Kích hoạt alert
if (newBoredRate >= 40) {
  setShowAlert(true);
} else {
  setShowAlert(false);
}
```

### UI Alert

```jsx
{
  showAlert && (
    <div
      style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}
    >
      <div
        className="alert alert-warning"
        style={{
          background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
        }}
      >
        <strong>⚠️ Cảnh báo!</strong>
        <p>Tỷ lệ học sinh chán nản đạt {boredRate}%</p>
        <small>Hãy thay đổi phương pháp dạy hoặc tăng tương tác</small>
      </div>
    </div>
  );
}
```

### Gợi Ý Cho Giáo Viên

- 0-20%: ✅ Tuyệt vời - Lớp rất hứng thú
- 20-40%: 👍 Tốt - Có thể cải thiện
- **40%+**: ⚠️ **Cảnh báo** - Cần thay đổi phương pháp dạy

---

## 📝 Ghi Chú

- **Base URL:** `http://localhost:8000`
- **Content-Type:** `multipart/form-data` cho file, `application/json` cho dữ liệu
- **Timeout:** 10-30 giây tùy loại request
- **Retry:** Không tự động, cần handle ở component
- **Progress Tracking:** Hỗ trợ `onUploadProgress` cho `/monitoring/upload-video/`

---

## 💾 localStorage Caching

Hệ thống sử dụng `localStorage` để cache dữ liệu session và danh sách buổi học:

### 1. lastSessionData

**Lưu lúc:** Khi kết thúc buổi học (POST `/sessions/end_session` thành công)  
**Sử dụng:** Hiển thị dữ liệu session vừa lưu trên AnalyticsPage  
**Xóa lúc:** Sau khi AnalyticsPage load xong

```javascript
localStorage.setItem("lastSessionData", JSON.stringify(sessionData));
// Sau đó AnalyticsPage tự động load và xóa
```

### 2. sessionsList

**Lưu lúc:** Khi kết thúc buổi học (GET `/sessions/recent_classes` thành công)  
**Sử dụng:** Cập nhật danh sách buổi học trên AnalyticsPage mà không cần fetch lại  
**Xóa lúc:** Sau khi AnalyticsPage sử dụng xong

```javascript
localStorage.setItem("sessionsList", JSON.stringify(response.data.data));
// Sau đó AnalyticsPage tự động load và xóa
```

### 3. Lợi Ích

- ✅ Tránh flicker/loading trên AnalyticsPage
- ✅ Tăng tốc độ chuyển trang
- ✅ Dữ liệu luôn up-to-date từ backend
- ✅ Fallback nếu API thất bại

---

**Cập nhật:** 28-11-2024  
**Phiên bản:** 1.1
