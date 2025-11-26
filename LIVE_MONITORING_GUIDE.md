# 🎥 Live Monitoring with Real-time Emotion Detection

**Tính năng mới: Upload video và nhận diện cảm xúc real-time**

## 📋 Các chức năng

### 1. **Webcam Live Monitoring**

- Nhấn "**Start Webcam**" để khởi động camera
- Hệ thống sẽ phân tích cảm xúc mỗi 500ms
- Hiển thị:
  - 😊 Cảm xúc hiện tại
  - 📊 Tỷ lệ cảm xúc tích cực (%)
  - 👥 Số khuôn mặt được phát hiện
  - 📈 Phân bố cảm xúc theo loại

### 2. **Video File Upload & Analysis** (MỚI)

- Nhấn "**Upload Video**" để chọn video từ máy tính
- Hệ thống phát video và phân tích real-time
- Hiển thị tiến độ video: `2:45 / 5:30`
- Các cảm xúc được lưu vào timeline trong quá trình phát

### 3. **Export to Analytics** (MỚI)

- Sau khi phát video hoặc webcam
- Nhấn "📊 Export [N] frames to Analytics"
- Tự động chuyển sang tab "Analytics"
- Xem biểu đồ phân tích chi tiết

---

## 🎯 Quy trình sử dụng

### Kịch bản 1: Webcam Real-time

```
1. Vào tab "Live Monitoring"
2. Nhấn "Start Webcam"
3. Để hệ thống phân tích (ghi nhận cảm xúc)
4. Sau khi xong, nhấn "Stop"
5. Nhấn "Export [N] frames to Analytics"
6. Xem chi tiết trong tab "Analytics"
```

### Kịch bản 2: Video File Analysis

```
1. Vào tab "Live Monitoring"
2. Nhấn "Upload Video"
3. Chọn file video từ máy (MP4, AVI, MOV, WebM)
4. Video sẽ tự động phát và phân tích cảm xúc real-time
5. Chờ video phát xong (hoặc nhấn Stop)
6. Nhấn "Export [N] frames to Analytics"
7. Xem biểu đồ chi tiết
```

### Kịch bản 3: Tách ra - Phân tích video chi tiết

```
1. Tab "Upload Video" - Dùng để upload và phân tích
2. Sẽ hiển thị timeline chi tiết
3. Có thể export kết quả
```

---

## 🎬 Định dạng Video Hỗ trợ

| Format | Extension | Status          |
| ------ | --------- | --------------- |
| MP4    | .mp4      | ✅ Full support |
| AVI    | .avi      | ✅ Full support |
| MOV    | .mov      | ✅ Full support |
| WebM   | .webm     | ✅ Full support |
| MKV    | .mkv      | ⚠️ May work     |
| 3GP    | .3gp      | ⚠️ Limited      |

**Khuyến nghị:** Dùng **MP4** để tương thích tốt nhất

---

## ⚙️ Cài đặt

### Độ phân giải video

- Tối ưu: **640x480** hoặc **1280x720**
- Tối đa: Không giới hạn nhưng ảnh hưởng hiệu suất

### Tốc độ phân tích

- **Webcam**: 1 frame mỗi 500ms (giảm tải API)
- **Video**: 1 frame mỗi 300ms (phân tích chi tiết hơn)

### Số frame tối đa

- Không có giới hạn
- Tùy thuộc vào dung lượng bộ nhớ

---

## 📊 Dữ liệu xuất ra

### Mỗi frame được ghi nhận:

```json
{
  "frame": 0,
  "current_emotion": "Happy",
  "positive_rate": 75,
  "emotion_distribution": {
    "Happy": 3,
    "Neutral": 1,
    "Sad": 0,
    "Angry": 0,
    "Surprise": 0,
    "Disgust": 0,
    "Fear": 0
  }
}
```

### Analytics sẽ tính:

- ✅ Tổng số frame phân tích
- ✅ Cảm xúc chiếm ưu thế
- ✅ Tỷ lệ cảm xúc tích cực (%)
- ✅ Xu hướng cảm xúc theo thời gian
- ✅ Gợi ý dạy học dựa trên cảm xúc

---

## 🎨 Giao diện thành phần

```
Live Monitoring Page
├─ Tabs: [Live Monitoring] [Upload Video] [Analytics]
│
├─ LEFT PANEL (col-8)
│  ├─ Video player
│  │  ├─ Webcam stream (khi dùng Start Webcam)
│  │  └─ Video file (khi dùng Upload Video)
│  │
│  ├─ Buttons
│  │  ├─ Start Webcam | Upload Video (khi không stream)
│  │  └─ Stop (khi đang stream)
│  │
│  ├─ Video time (chỉ hiển thị khi phát video)
│  │  └─ "2:45 / 5:30"
│  │
│  └─ Status alert
│     └─ "🎥 Webcam streaming..." hoặc "📹 Video playing..."
│
└─ RIGHT PANEL (col-4)
   ├─ Current Emotion (card)
   │  └─ Hiển thị cảm xúc hiện tại với màu sắc
   ├─ Positive Rate (progress bar)
   │  └─ Tỷ lệ % cảm xúc tích cực
   ├─ Faces Detected (số)
   │  └─ Đếm khuôn mặt
   └─ Emotion Distribution (chart mini)
      └─ Phân bố từng loại cảm xúc
```

---

## 💡 Mẹo sử dụng

1. **Để camera tiếp xúc ánh sáng tốt** - Sẽ nhận diện chính xác hơn
2. **Video nên có độ sáng tốt** - Tránh quay trong điều kiện thiếu sáng
3. **Để hệ thống chạy đủ lâu** - Có đủ dữ liệu để phân tích
4. **Xuất ra Analytics ngay** - Để xem chi tiết biểu đồ
5. **Kiểm tra kết nối backend** - Đảm bảo server FastAPI đang chạy

---

## 🐛 Xử lý sự cố

### Vấn đề: Video không phát

**Giải pháp:**

- Kiểm tra định dạng video (dùng MP4)
- Thử video khác
- Kiểm tra quyền truy cập file

### Vấn đề: Nhận diện chậm

**Giải pháp:**

- Kiểm tra kết nối internet
- Kiểm tra backend server đang chạy
- Giảm độ phân giải video

### Vấn đề: Camera không hoạt động

**Giải pháp:**

- Kiểm tra quyền truy cập camera
- Thử browser khác (Chrome/Edge tốt nhất)
- Khởi động lại browser

### Vấn đề: Không thấy nút "Export to Analytics"

**Giải pháp:**

- Phải phát video/webcam ít nhất 1 lần
- Phải có dữ liệu frame (sessionTimeline > 0)

---

## 🔧 Công nghệ

**Frontend:**

- React Hooks (useState, useRef, useEffect)
- Canvas API (để capture frame)
- Blob API (để convert frame thành ảnh)
- Axios (để gửi đến backend)

**Backend:**

- FastAPI (`/monitoring/frame`)
- YOLOv1 model nhận diện cảm xúc
- OpenCV (xử lý ảnh)

---

## 📈 Cải tiến tương lai

- [ ] Lưu video đã phân tích
- [ ] Bỏ qua frame (skip N frames) để tăng tốc độ
- [ ] Hiển thị bounding box khuôn mặt trên video
- [ ] Export video với overlay cảm xúc
- [ ] Phân tích từng khuôn mặt riêng lẻ
- [ ] So sánh giữa các buổi học

---

## ✅ Kiểm tra danh sách

- ✅ Webcam real-time hoạt động
- ✅ Video upload hoạt động
- ✅ Phân tích cảm xúc real-time
- ✅ Timeline được ghi nhận đúng
- ✅ Export to Analytics đúng
- ✅ Analytics hiển thị charts
- ✅ Giao diện responsive

---

**Phiên bản**: 1.0.0  
**Cập nhật**: Nov 26, 2025  
**Trạng thái**: ✅ Ready for testing
