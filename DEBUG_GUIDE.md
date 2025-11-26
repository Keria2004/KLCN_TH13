# 🔍 Hướng Dẫn Debug Pipeline AI - Nhận Diện Cảm Xúc

## 🚨 Vấn Đề Hiện Tại

Frontend không gửi request API tới backend khi nhấn "Start Detect"

---

## ✅ Checklist Debug

### 1️⃣ **Kiểm Tra Backend Có Đang Chạy Không**

```bash
# Terminal 1: Kiểm tra xem port 8000 có mở không
netstat -tuln | grep 8000

# Hoặc thử curl trực tiếp
curl -X GET http://localhost:8000/docs
```

**Dấu hiệu server đang chạy:**

- Trả về Swagger docs HTML
- Status code 200
- URL `http://localhost:8000/docs` mở được

**Nếu không chạy:**

```bash
cd D:\KLCN_TH13-master\Backend
python -m uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

---

### 2️⃣ **Kiểm Tra Frontend Console**

Mở **Developer Tools** (F12) trong browser:

1. Tab **Network**

   - Start Detect
   - Xem có request POST tới `/monitoring/frame` không?
   - Status code phải là 200 hoặc 2xx

2. Tab **Console**
   - Tìm `console.log("Sending frame to API", ...)`
   - Kiểm tra lỗi axios

**Dấu hiệu đúng:**

```
Sending frame to API: http://localhost:8000/monitoring/frame
API Response: { current_emotion: "Happy", positive_rate: 95, ... }
```

**Lỗi phổ biến:**

```
AxiosError: Network Error
net::ERR_CONNECTION_REFUSED
```

→ Backend không chạy

---

### 3️⃣ **Kiểm Tra Models Được Load**

Mở backend logs khi start:

```
✅ Models loaded. Emotion labels: ['Happy', 'Sad', 'Angry', ...]
Processing frame shape: (480, 640, 3)
Detected 3 faces
```

**Nếu thấy lỗi:**

- Models không tìm thấy → Kiểm tra đường dẫn
- CUDA lỗi → Cài lại dependencies

---

### 4️⃣ **Kiểm Tra Pipeline Từng Bước**

#### **Bước 1: Canvas Capture**

```javascript
// Kiểm tra canvas có capture frame không
canvas.toBlob((blob) => {
  console.log("Canvas blob size:", blob.size);
});
```

#### **Bước 2: API Call**

```javascript
console.log("Sending to:", `${API_BASE_URL}/monitoring/frame`);
console.log("Blob size:", formData.get("file").size);
```

#### **Bước 3: Response Parse**

```javascript
console.log("Response keys:", Object.keys(response.data));
console.log("Emotion:", response.data.current_emotion);
```

---

## 🔧 Fix Các Lỗi Thường Gặp

### **Lỗi 1: "Cannot encode frame"**

**Nguyên nhân**: Canvas blob không valid

**Fix**: Kiểm tra canvas có được render không

```javascript
if (canvas.width === 0 || canvas.height === 0) {
  console.error("Canvas size is 0");
}
```

---

### **Lỗi 2: "Models not found"**

**Nguyên nhân**: Path tới model sai

**Kiểm tra**:

```bash
ls DeepLearning/models/
# Phải có:
# - face_detection.pt
# - fer_YOLOv1.pt
```

**Fix trong ai_service.py**:

```python
MODEL_DIR = os.path.join(os.path.dirname(__file__), "...", "models")
print(f"Looking for models in: {MODEL_DIR}")
```

---

### **Lỗi 3: "Connection refused"**

**Nguyên nhân**: Backend không chạy

**Fix**:

1. Mở Terminal
2. `cd Backend`
3. `python -m uvicorn app.server:app --reload --host 0.0.0.0 --port 8000`
4. Chờ thấy: `Uvicorn running on http://0.0.0.0:8000`

---

### **Lỗi 4: "Webcam không hoạt động"**

**Nguyên nhân**: Permission hoặc hardware issue

**Fix**:

```javascript
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => console.log("Webcam ready"))
  .catch((err) => console.error("Webcam error:", err.message));
```

---

## 📊 Mở Rộng Debug

### **Console Logs Quan Trọng**

Tìm kiếm những message này:

```javascript
// ✅ Tốt
console.log("Sending frame to API: http://localhost:8000/monitoring/frame");
console.log("API Response:", response.data);
console.log("Emotion:", "Happy", "Rate:", 95);

// ❌ Xấu
console.error("Analysis error: Network Error");
console.error("Cannot decode frame");
```

---

### **API Test Direct**

Test API trực tiếp mà không qua frontend:

```bash
# 1. Tạo test image
# (dùng bất kỳ jpg/png file nào)

# 2. Gửi POST request
curl -X POST "http://localhost:8000/monitoring/frame" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.jpg"

# 3. Xem response
# Phải có: {
#   "current_emotion": "Happy",
#   "positive_rate": 95,
#   "faces": [...]
# }
```

---

## 🎯 Step-by-Step Debug Process

### **Quá Trình Kiểm Tra**

1. **Backend Start** ✓

   ```bash
   cd Backend
   python -m uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
   ```

   → Xem Swagger docs tại `http://localhost:8000/docs`

2. **Frontend Load** ✓

   ```bash
   cd FrontEnd
   npm run dev
   ```

   → Vào `http://localhost:5173`

3. **Mở Dev Tools** ✓

   - F12
   - Tab Network
   - Tab Console

4. **Test Webcam** ✓

   - Click "Webcam"
   - Xem video có hiển thị không?
   - Nếu không → permission issue

5. **Start Detect** ✓

   - Click "Start Detect"
   - Xem Network tab
   - POST request phải gửi tới `/monitoring/frame`

6. **Kiểm Tra Response** ✓

   - Tab Network → POST request → Response tab
   - Phải có JSON: `{current_emotion: "...", positive_rate: ..., faces: [...]}`

7. **Kiểm Tra State Update** ✓
   - Console: `console.log("Emotion:", currentEmotion)`
   - Biểu đồ phải update bên phải
   - Emotion count phải tăng

---

## 🐛 Thêm Debug Logs

Nếu cần debug chi tiết, thêm vào `LiveMonitoring.jsx`:

```javascript
// Trong startDetection
console.group("🎬 START DETECTION");
console.log("Stream Mode:", streamMode);
console.log("Is Streaming:", isStreaming);
console.log("Time:", new Date());
console.groupEnd();

// Trong analyzeVideo
console.group("📹 ANALYZE FRAME");
console.log("Canvas Size:", canvas.width, "x", canvas.height);
console.log("Is Detecting (ref):", isDetectingRef.current);
console.groupEnd();

// Trong response handler
console.group("✅ API SUCCESS");
console.log("Emotion:", current_emotion);
console.log("Positive Rate:", positive_rate);
console.log("Face Count:", faces.length);
console.groupEnd();

// Trong error handler
console.group("❌ API ERROR");
console.error("Error:", error.message);
console.error("Response:", error.response?.data);
console.groupEnd();
```

---

## 📋 Checklist Trước Test

- [ ] Backend đang chạy trên port 8000
- [ ] Models được load thành công
- [ ] Frontend vào được tại localhost:5173
- [ ] Webcam có quyền truy cập (hoặc video được upload)
- [ ] Network tab trong DevTools mở
- [ ] Console không có lỗi syntax
- [ ] API_BASE_URL = "http://localhost:8000"

---

## 💡 Quick Fix

**Nếu không thấy request API:**

1. **Kiểm tra isDetectingRef.current**

   ```javascript
   console.log("isDetectingRef:", isDetectingRef.current);
   // Phải là `true` khi bấm "Start Detect"
   ```

2. **Kiểm tra canvas.toBlob callback**

   ```javascript
   canvas.toBlob(
     (blob) => {
       console.log("toBlob called, blob size:", blob?.size);
     },
     "image/jpeg",
     0.95
   );
   ```

3. **Kiểm tra analyzeVideo được gọi không**
   ```javascript
   const analyzeVideo = async () => {
     console.log("analyzeVideo called");
     // ...
   };
   ```

---

**Phiên bản**: 1.0  
**Cập nhật**: 2024-11-26
