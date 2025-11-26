# 🎥 New Feature: Video Upload with Real-time Emotion Detection

## 📢 Tính năng vừa được thêm

Giờ đây bạn có thể **upload video từ máy tính** và **nhận diện cảm xúc real-time** trong lúc video đang phát!

---

## 🎯 Cách sử dụng

### **Cách 1: Dùng Webcam (như trước)**

```
1. Vào "Live Monitoring"
2. Nhấn "🎥 Start Webcam"
3. Để hệ thống phân tích
4. Xong, nhấn "Stop"
5. Nhấn "📊 Export [N] frames to Analytics"
```

### **Cách 2: Upload Video File (MỚI) ⭐**

```
1. Vào "Live Monitoring"
2. Nhấn "📹 Upload Video"
3. Chọn video từ máy tính (MP4, AVI, MOV)
4. ✅ Video tự động phát + phân tích cảm xúc real-time
5. Xong, nhấn "📊 Export [N] frames to Analytics"
```

---

## ✨ Ưu điểm

| Tính năng           | Trước       | Giờ           |
| ------------------- | ----------- | ------------- |
| Webcam live         | ✅          | ✅            |
| Video upload        | ❌          | ✅            |
| Real-time analysis  | ✅ (webcam) | ✅ (cả video) |
| Export to analytics | ✅          | ✅            |

---

## 📊 Quy trình dữ liệu

```
Video Upload
    ↓
Phát video + Phân tích frame
    ↓
Lưu timeline (frame, emotion, positive_rate)
    ↓
Nhấn Export
    ↓
Chuyển đến Analytics
    ↓
Xem biểu đồ chi tiết
```

---

## 🎬 Định dạng Video Hỗ trợ

- ✅ **MP4** (Được khuyến nghị)
- ✅ **AVI**
- ✅ **MOV**
- ✅ **WebM**

---

## 📂 Code Changes

### File Thay đổi:

- ✅ `LiveMonitoring.jsx` - Thêm video upload + real-time analysis
- ✅ `MonitorPage.jsx` - Thêm callback export
- ✅ `LiveMonitoring.css` - Thêm styling cho video controls
- ✅ `LIVE_MONITORING_GUIDE.md` - Hướng dẫn sử dụng mới

---

## 💻 Kỹ thuật

**Frontend:**

```javascript
// Upload video
<input type="file" accept="video/*" onChange={handleVideoUpload} />;

// Play video + analyze
videoRef.current.src = URL.createObjectURL(file);
videoRef.current.play();

// Capture frame every 300ms
canvas.toBlob((blob) => {
  axios.post("/monitoring/frame", formData);
});
```

**Backend:**

```python
# Không thay đổi - sử dụng endpoint cũ
POST /monitoring/frame
```

---

## 🚀 Cách thử

### Bước 1: Chuẩn bị

```bash
# Terminal 1: Backend
cd Backend
uvicorn app.server:app --reload --port 8000

# Terminal 2: Frontend
cd FrontEnd
npm run dev
```

### Bước 2: Thử nghiệm

```
1. Mở http://localhost:5173
2. Vào tab "Live Monitoring"
3. Nhấn "📹 Upload Video"
4. Chọn file video
5. Xem video phát + cảm xúc được phân tích
6. Sau khi xong, nhấn "Export to Analytics"
```

---

## ⚙️ Cài đặt

**Tốc độ phân tích:**

- Webcam: 1 frame / 500ms (giảm tải)
- Video: 1 frame / 300ms (chi tiết hơn)

**Định dạng:**

- Đầu vào: Video file (MP4, AVI, MOV, WebM)
- Đầu ra: Timeline JSON → Analytics Dashboard

---

## ✅ Kiểm tra

- [x] Webcam vẫn hoạt động bình thường
- [x] Video upload + phát
- [x] Real-time emotion detection
- [x] Timeline được ghi nhận
- [x] Export to Analytics
- [x] Analytics hiển thị đúng

---

## 📚 Tài liệu

- **LIVE_MONITORING_GUIDE.md** - Hướng dẫn chi tiết
- **TESTING_GUIDE.md** - Test cases và kiểm tra
- **LiveMonitoring.jsx** - Code chính

---

## 🎓 Ví dụ

### Ví dụ 1: Phân tích cuộc họp lớp

```
1. Record video buổi họp (5 phút)
2. Upload video
3. Hệ thống phân tích tất cả frames
4. Export to Analytics
5. Xem chart cảm xúc của cả lớp
6. Nhận gợi ý cải thiện dạy học
```

### Ví dụ 2: So sánh cảm xúc từng người

```
1. Record video riêng biệt cho mỗi học sinh
2. Upload từng video riêng
3. Export analytics cho mỗi em
4. So sánh biểu đồ
5. Nhận diện học sinh có vấn đề
```

---

## 🐛 Xử lý lỗi

| Lỗi                             | Giải pháp                           |
| ------------------------------- | ----------------------------------- |
| "Video không phát"              | Dùng MP4 hoặc thử video khác        |
| "Không nhận diện cảm xúc"       | Kiểm tra ánh sáng, kiểm tra backend |
| "Export button không xuất hiện" | Phải phát ít 1 frame trước          |

---

## 🔮 Tương lai

- [ ] Xuất video có overlay cảm xúc
- [ ] Phân tích từng khuôn mặt riêng
- [ ] Lưu lịch sử buổi học
- [ ] So sánh giữa các buổi

---

## 📞 Support

Nếu có vấn đề:

1. Kiểm tra **LIVE_MONITORING_GUIDE.md**
2. Kiểm tra **TESTING_GUIDE.md**
3. Kiểm tra browser console (F12)
4. Kiểm tra backend logs

---

**Version:** 1.0.0  
**Status:** ✅ Ready  
**Last Updated:** Nov 26, 2025
