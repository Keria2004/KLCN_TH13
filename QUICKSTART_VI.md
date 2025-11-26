# 🚀 Hướng Dẫn Khởi Động Nhanh

## ⚡ Bắt Đầu Trong 5 Phút

Hệ thống Giám Sát Cảm Xúc Lớp Học - Phiên bản Tiếng Việt

---

## 📋 Điều Kiện Tiên Quyết

- ✅ Python 3.10+
- ✅ Node.js 18+
- ✅ Git
- ✅ Webcam hoặc video để test

---

## 🔧 Bước 1: Thiết Lập Backend

### Windows

```bash
# Mở PowerShell
cd D:\KLCN_TH13-master\Backend

# Tạo môi trường ảo
python -m venv env

# Kích hoạt
.\env\Scripts\activate

# Cài đặt
pip install -r requirements.txt

# Chạy
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

### Linux/Mac

```bash
cd Backend

# Tạo môi trường ảo
python3 -m venv env

# Kích hoạt
source env/bin/activate

# Cài đặt
pip install -r requirements.txt

# Chạy
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

**Dấu hiệu thành công:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000
✅ Models loaded. Emotion labels: ['Happy', 'Sad', ...]
```

---

## 🔧 Bước 2: Thiết Lập Frontend (Terminal Mới)

```bash
cd D:\KLCN_TH13-master\FrontEnd

# Cài đặt thư viện
npm install

# Chạy dev server
npm run dev
```

**Dấu hiệu thành công:**

```
➜  Local:   http://localhost:5173/
```

---

## ✅ Bước 3: Kiểm Tra Kết Nối

### Kiểm Tra Backend

```bash
curl -X GET http://localhost:8000/monitoring/health
```

**Phản hồi dự kiến:**

```json
{
  "status": "healthy",
  "models_loaded": true,
  "emotion_labels": ["Happy", "Sad", "Angry", ...]
}
```

### Kiểm Tra Frontend

1. Mở browser: `http://localhost:5173`
2. Mở DevTools (F12)
3. Tab Console không có lỗi đỏ
4. Tab Network mở sẵn

---

## 🎬 Bước 4: Test Nhận Diện Cảm Xúc

### Sử Dụng Webcam

1. Vào trang **Monitoring** (tab "Live Monitoring")
2. Nhấn nút **"Webcam"** 🎥
   - Xem có video hiển thị không?
   - Cấp quyền camera nếu được hỏi
3. Nhấn **"Start Detect"** 🟢
   - Chờ 1-2 giây
   - Kiểm tra Tab Network → Xem request POST tới `/monitoring/frame`
4. Xem **Biểu đồ** bên phải cập nhật
   - Cảm xúc hiện tại
   - Tỷ lệ tích cực
   - Số khuôn mặt phát hiện
5. Nhấn **"End Session"** 🏁
   - Tự động chuyển sang tab Analytics
   - Xem kết quả phân tích

### Sử Dụng Video

1. Chuẩn bị file video (MP4, AVI, MOV, WebM)
2. Nhấn **"Upload Video"** 📤
3. Chọn file video
4. Chờ video tải xong
5. Nhấn **"Start Detect"** 🟢
6. Xem biểu đồ cập nhật theo real-time
7. Khi video kết thúc → Tự động chuyển sang Analytics

---

## 📊 Kết Quả Dự Kiến

### Frontend

```
✅ Video hiển thị (Webcam hoặc upload)
✅ Emotion Display: "Happy" (cảm xúc hiện tại)
✅ Positive Rate: 85% (tỷ lệ tích cực)
✅ Face Count: 3 (số khuôn mặt)
✅ Biểu đồ Bar cập nhật
✅ Timeline data thu thập
```

### Backend Logs

```
✅ Received frame from /monitoring/frame
✅ Detected 3 faces
✅ Emotion: Happy (95% confident)
✅ Processing time: 0.52s
```

### Analytics

```
✅ Total Frames: 450
✅ Dominant Emotion: Happy (55%)
✅ Average Positive Rate: 82%
✅ Class Sentiment: Positive 👍
```

---

## 🚨 Lỗi Thường Gặp & Cách Fix

| Lỗi                      | Nguyên Nhân                     | Cách Fix                              |
| ------------------------ | ------------------------------- | ------------------------------------- |
| **Connection refused**   | Backend không chạy              | `uvicorn app.server:app --reload`     |
| **Cannot access camera** | Quyền webcam                    | Cấp quyền cho browser                 |
| **Models not found**     | Đường dẫn model sai             | Kiểm tra `DeepLearning/models/`       |
| **CORS error**           | Frontend-Backend không liên kết | Đảm bảo CORS middleware trong backend |
| **npm install lỗi**      | Node version cũ                 | Cập nhật Node.js lên 18+              |
| **Video không chạy**     | Codec không hỗ trợ              | Chuyển sang MP4                       |

---

## 🧪 Test Các Chức Năng

### Test 1: Webcam Thời Gian Thực ✅

```
1. Click "Webcam"
2. Click "Start Detect"
3. Kiểm tra DevTools Network tab
   → POST /monitoring/frame
   → Status 200
4. Xem biểu đồ cập nhật
5. Click "End Session"
```

**Thời gian**: 2-3 phút

### Test 2: Upload Video ✅

```
1. Click "Upload Video"
2. Chọn file video (MP4)
3. Click "Start Detect"
4. Chờ video chạy xong
5. Xem Analytics tự động hiển thị
```

**Thời gian**: 5-10 phút (tùy độ dài video)

### Test 3: End Session ✅

```
1. Start detection (webcam hoặc video)
2. Chờ vài frame được phân tích
3. Click "End Session"
4. Kiểm tra:
   - Biểu đồ đóng
   - Dữ liệu được lưu
   - Chuyển tới Analytics tab
   - Hiển thị thông báo xác nhận
```

**Thời gian**: 1 phút

---

## 📈 Các Cảm Xúc

**7 cảm xúc được nhận diện:**

1. 😊 **Happy** (Vui) - Mỉm cười
2. 😢 **Sad** (Buồn) - Không vui
3. 😠 **Angry** (Tức Giận) - Cau mày
4. 😮 **Surprise** (Ngạc Nhiên) - Bất ngờ
5. 😐 **Neutral** (Trung Lập) - Không biểu cảm
6. 🤢 **Disgust** (Ghê Tởm) - Không thích
7. 😨 **Fear** (Sợ Hãi) - Lo lắng

---

## 💡 Mẹo Sử Dụng

### Để Kết Quả Tốt Nhất:

✅ **Ánh sáng tốt** - Đảm bảo ánh sáng đủ  
✅ **Khuôn mặt rõ ràng** - Webcam có góc nhìn tốt  
✅ **Khoảng cách phù hợp** - 1-2 mét từ camera  
✅ **Video chất lượng** - Độ phân giải 720p trở lên  
✅ **Thời gian xử lý** - Chờ 1-2 giây giữa frames

---

## 🔧 Lệnh Hữu Ích

```bash
# Kiểm tra backend health
curl http://localhost:8000/monitoring/health

# Xem Swagger docs
# Browser: http://localhost:8000/docs

# Dừng backend
Ctrl + C (trong terminal backend)

# Dừng frontend
Ctrl + C (trong terminal frontend)

# Xem logs backend
# Xem output terminal backend

# Xem logs frontend
# Mở DevTools (F12) → Console tab
```

---

## 📚 Tài Liệu Chi Tiết

- **SETUP_GUIDE_VI.md** - Thiết lập chi tiết
- **UPLOAD_VIDEO_GUIDE.md** - Hướng dẫn upload video
- **DEBUG_GUIDE.md** - Gỡ lỗi vấn đề
- **TESTING_GUIDE.md** - Test đầy đủ
- **LIVE_MONITORING_GUIDE.md** - Giám sát trực tiếp

---

## 🎯 Bước Tiếp Theo

### Sau Khi Test Thành Công:

1. ✅ Thay đổi cấu hình backend/frontend theo nhu cầu
2. ✅ Tích hợp với database của trường
3. ✅ Tùy chỉnh AI insights cho lớp học cụ thể
4. ✅ Triển khai lên server (Docker, AWS, etc.)
5. ✅ Đào tạo giáo viên sử dụng

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Xem **DEBUG_GUIDE.md** để gỡ lỗi
2. Kiểm tra backend logs
3. Mở DevTools (F12) xem console errors
4. Chạy test script: `python test_backend_api.py`

---

**🎉 Chúc mừng! Bạn đã sẵn sàng sử dụng hệ thống.**

Phiên bản: 1.0  
Cập nhật: 2024-11-26  
Ngôn ngữ: Tiếng Việt
