# 📖 Tài Liệu Hệ Thống Giám Sát Cảm Xúc Lớp Học

**Phiên bản**: 2.0  
**Cập nhật**: 2024-11-26  
**Ngôn ngữ**: Tiếng Việt 🇻🇳

---

## 📚 Danh Sách Tài Liệu

### 1. **QUICKSTART_VI.md** 🚀 ⭐ **BẮT ĐẦU TỪ ĐÂY**

**Mục đích**: Khởi động hệ thống trong 5 phút

- ✅ Thiết lập Backend
- ✅ Thiết lập Frontend
- ✅ Kiểm tra kết nối
- ✅ Test nhận diện cảm xúc
- ✅ Xử lý lỗi phổ biến

**Thời gian đọc**: 10 phút  
**Độ khó**: ⭐ Dễ

---

### 2. **SETUP_GUIDE_VI.md** 📋

**Mục đích**: Hướng dẫn chi tiết cài đặt

- ✅ Kiến trúc hệ thống
- ✅ Yêu cầu hệ thống
- ✅ Cài đặt Backend đầy đủ
- ✅ Cài đặt Frontend đầy đủ
- ✅ Cấu hình API
- ✅ Biến môi trường
- ✅ Xử lý sự cố

**Thời gian đọc**: 20 phút  
**Độ khó**: ⭐⭐ Trung bình

---

### 3. **UPLOAD_VIDEO_GUIDE.md** 📤

**Mục đích**: Hướng dẫn chi tiết upload video

- ✅ Các tính năng mới
- ✅ Cách sử dụng bước-bước
- ✅ Bắt đầu nhận diện
- ✅ Theo dõi biểu đồ real-time
- ✅ Dừng và kết thúc buổi học
- ✅ Dữ liệu lưu trữ
- ✅ Các cảm xúc được nhận diện
- ✅ Xử lý sự cố

**Thời gian đọc**: 15 phút  
**Độ khó**: ⭐ Dễ

---

### 4. **TESTING_GUIDE_VI.md** 🧪

**Mục đích**: Hướng dẫn test đầy đủ

- ✅ 12+ test cases chi tiết
- ✅ Test 1: Webcam thời gian thực
- ✅ Test 2: Upload video
- ✅ Test 3: Phân tích thời gian thực
- ✅ Test 4: Thu thập dữ liệu timeline
- ✅ Test 5: Xuất dữ liệu
- ✅ Test 6: Analytics Dashboard
- ✅ Test 7-12: Các test khác
- ✅ Bảng kết quả
- ✅ Performance benchmarks

**Thời gian đọc**: 25 phút  
**Độ khó**: ⭐⭐ Trung bình

---

### 5. **DEBUG_GUIDE.md** 🔍

**Mục đích**: Hướng dẫn gỡ lỗi chi tiết

- ✅ Checklist debug
- ✅ Kiểm tra Backend
- ✅ Kiểm tra Frontend Console
- ✅ Kiểm tra Models được load
- ✅ Kiểm tra pipeline từng bước
- ✅ Fix các lỗi thường gặp
- ✅ Mở rộng debug
- ✅ Test API trực tiếp

**Thời gian đọc**: 20 phút  
**Độ khó**: ⭐⭐⭐ Khó

---

### 6. **FRONTEND_DEBUG_SCRIPT.js** 💻

**Mục đích**: Script debug cho browser console

- ✅ Kiểm tra API config
- ✅ Kiểm tra state
- ✅ Test canvas capture
- ✅ Test API request
- ✅ Monitor API calls
- ✅ Quick diagnostic

**Cách dùng**: Paste vào browser console (F12 → Console)

---

### 7. **test_backend_api.py** 🐍

**Mục đích**: Python script test backend

- ✅ Test backend health
- ✅ Test frame analysis
- ✅ Test từ webcam
- ✅ Hiển thị kết quả chi tiết

**Cách dùng**:

```bash
python test_backend_api.py
```

---

## 🗂️ Cấu Trúc Thư Mục

```
KLCN_TH13-master/
├── 📋 Tài Liệu (Files .md)
│   ├── QUICKSTART_VI.md         ⭐ BẮT ĐẦU TỪ ĐÂY
│   ├── SETUP_GUIDE_VI.md
│   ├── UPLOAD_VIDEO_GUIDE.md
│   ├── TESTING_GUIDE_VI.md
│   ├── DEBUG_GUIDE.md
│   ├── FEATURE_CHECKLIST.md
│   ├── NEW_FEATURE_SUMMARY.md
│   ├── INDEX.md (Tiếng Anh)
│   └── Các files khác...
│
├── 💻 Script Debug
│   ├── FRONTEND_DEBUG_SCRIPT.js
│   └── test_backend_api.py
│
├── 📁 Backend
│   ├── app/
│   │   ├── server.py            # Main server
│   │   ├── routers/
│   │   │   └── monitoring_router.py  # API endpoints
│   │   ├── service/
│   │   │   ├── emotion_service.py
│   │   │   └── ai_service.py
│   │   ├── models/
│   │   ├── schemas/
│   │   └── database/
│   ├── requirements.txt
│   └── .env
│
├── 🎨 Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── monitoring/
│   │   │   │   ├── LiveMonitoring.jsx    ⭐ Main component
│   │   │   │   ├── VideoUpload.jsx
│   │   │   │   └── EmotionBarChart.jsx
│   │   │   ├── analytics/
│   │   │   │   └── AnalyticsDashboard.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── MonitorPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   └── ...
│   │   ├── config/
│   │   │   └── apiConfig.js
│   │   ├── styles/
│   │   │   └── LiveMonitoring.css
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── 🤖 DeepLearning
│   ├── models/
│   │   ├── face_detection.pt
│   │   ├── fer_YOLOv1.pt
│   │   └── ...
│   ├── utils/
│   │   ├── preprocessor.py
│   │   ├── inference.py
│   │   └── ...
│   └── requirements.txt
│
└── 📹 videos/
    └── (Video test files)
```

---

## 🚀 Hành Trình Nhanh

### Cho người dùng mới:

1. **Đọc**: QUICKSTART_VI.md (10 phút)
2. **Cài đặt**: Làm theo 4 bước (10 phút)
3. **Test**: Run test cơ bản (5 phút)
4. **Tìm lỗi**: Nếu có, xem DEBUG_GUIDE.md

### Cho người phát triển:

1. **Đọc**: SETUP_GUIDE_VI.md (20 phút)
2. **Cài đặt**: Chi tiết đầy đủ
3. **Test**: TESTING_GUIDE_VI.md (25 phút)
4. **Debug**: DEBUG_GUIDE.md nếu cần

### Cho người dùng nâng cao:

1. **Cấu hình**: Thay đổi .env file
2. **Mô Hình**: Thêm/sửa YOLOv1 models
3. **API**: Mở rộng endpoints
4. **UI**: Tùy chỉnh React components

---

## ✅ Danh Sách Kiểm Tra Thiết Lập

Trước khi bắt đầu, đảm bảo:

- [ ] Python 3.10+
- [ ] Node.js 18+
- [ ] Git
- [ ] Webcam (để test)
- [ ] Video test file (MP4)
- [ ] Đủ dung lượng đĩa (≥ 5GB)
- [ ] Kết nối internet

---

## 🔧 Các Công Cụ Hữu Ích

### Backend API Test

```bash
# Health check
curl -X GET http://localhost:8000/monitoring/health

# API docs
http://localhost:8000/docs

# Python test script
python test_backend_api.py
```

### Frontend Debug

```javascript
// Browser Console (F12)
checkState(); // Kiểm tra state
testCanvasCapture(); // Test canvas
testAPIRequest(); // Test API
monitorAPICalls(); // Theo dõi API calls
quickDiagnostic(); // Chẩn đoán nhanh
```

---

## 🎯 Mục Tiêu Hoàn Thành

Sau khi đọc tài liệu này:

✅ Bạn có thể **cài đặt hệ thống**  
✅ Bạn có thể **chạy hệ thống**  
✅ Bạn có thể **test hệ thống**  
✅ Bạn có thể **gỡ lỗi hệ thống**  
✅ Bạn có thể **sử dụng hệ thống** để giám sát cảm xúc lớp học

---

## 🚨 Gặp Vấn Đề?

1. **Lỗi cài đặt**? → Xem SETUP_GUIDE_VI.md
2. **Lỗi khi chạy**? → Xem DEBUG_GUIDE.md
3. **Lỗi test**? → Xem TESTING_GUIDE_VI.md
4. **Hỏi về tính năng**? → Xem UPLOAD_VIDEO_GUIDE.md
5. **Lỗi API**? → Chạy `test_backend_api.py`
6. **Lỗi Frontend**? → Dùng FRONTEND_DEBUG_SCRIPT.js

---

## 🎓 Học Tập Thêm

### Backend

- **FastAPI**: https://fastapi.tiangolo.com/
- **Uvicorn**: https://www.uvicorn.org/
- **YOLOv1**: https://github.com/ultralytics/ultralytics

### Frontend

- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Recharts**: https://recharts.org/

### Deep Learning

- **OpenCV**: https://docs.opencv.org/
- **NumPy**: https://numpy.org/
- **Ultralytics**: https://github.com/ultralytics/ultralytics

---

## 📞 Hỗ Trợ

### Liên Hệ

- **Email**: [your-email@example.com]
- **GitHub**: [your-github-repo]
- **Documentation**: Xem các file .md

### Báo Cáo Lỗi

Vui lòng cung cấp:

1. Mô tả lỗi chi tiết
2. Bước tái hiện
3. Expected vs Actual
4. Console logs
5. Network tab screenshot

---

## 📝 Nhật Ký Thay Đổi

### v2.0 (2024-11-26)

- ✅ Thêm nút Start/Stop Detect
- ✅ Thêm nút End Session
- ✅ Real-time biểu đồ cập nhật
- ✅ Upload video với nhận diện cảm xúc
- ✅ Tất cả hướng dẫn tiếng Việt

### v1.0 (2024-11-20)

- ✅ Backend API hoàn thành
- ✅ Frontend components hoàn thành
- ✅ YOLOv1 models tích hợp
- ✅ Analytics dashboard hoàn thành

---

## 🎉 Chúc Mừng!

Bạn đã sẵn sàng sử dụng **Hệ Thống Giám Sát Cảm Xúc Lớp Học** 🎓

**Bước tiếp theo**: Mở QUICKSTART_VI.md và bắt đầu! 🚀

---

**Phiên bản**: 2.0  
**Cập nhật**: 2024-11-26  
**Ngôn ngữ**: Tiếng Việt 🇻🇳
