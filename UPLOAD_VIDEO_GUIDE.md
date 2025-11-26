# 📊 Hướng Dẫn Upload Video Với Nhận Diện Cảm Xúc Real-time

## 🎯 Tính Năng Mới

Hệ thống hiện hỗ trợ upload video và nhận diện cảm xúc với:

- ✅ Upload video hoặc khởi động webcam
- ✅ Nút **Start Detect** / **Stop Detect** để kiểm soát nhận diện
- ✅ **Biểu đồ real-time** cập nhật tức thì
- ✅ Nút **End Session** để kết thúc buổi học
- ✅ Tự động lưu dữ liệu và gửi tới Analytics

---

## 🚀 Cách Sử Dụng

### **Bước 1: Chọn Nguồn Video**

Trên giao diện Live Monitoring, bạn có 2 lựa chọn:

1. **Upload Video**
   - Nhấn nút "Upload Video"
   - Chọn file video (hỗ trợ MP4, AVI, MOV, WebM)
2. **Webcam Live**
   - Nhấn nút "Webcam" để khởi động camera
   - Cấp quyền truy cập camera nếu được yêu cầu

### **Bước 2: Bắt Đầu Nhận Diện**

Sau khi video hoặc webcam được khởi động:

1. Nhấn nút **"Start Detect"** (xanh)
2. Hệ thống bắt đầu:
   - 📹 Capture frame từ video/webcam
   - 🧠 Gửi tới API để phân tích cảm xúc
   - 📊 Cập nhật biểu đồ bên phải

### **Bước 3: Theo Dõi Biểu Đồ Real-time**

Bên phải màn hình hiển thị:

- **Biểu đồ Bar**: Số lượng frame theo cảm xúc
- **Thống Kê Cảm Xúc**: Danh sách cảm xúc được phát hiện (sắp xếp theo nhiều nhất)

Biểu đồ cập nhật **tự động** mỗi khi nhận diện xong 1 frame.

### **Bước 4: Dừng Hoặc Kết Thúc**

#### **Dừng Nhận Diện Tạm Thời**

- Nhấn nút **"Stop Detect"** (vàng)
- Video/webcam vẫn chạy, có thể bấm **"Start Detect"** để tiếp tục

#### **Kết Thúc Buổi Học**

- Nhấn nút **"End Session"** (đen)
- Hệ thống sẽ:
  - ⏹️ Dừng nhận diện
  - 🎥 Dừng video/webcam
  - 💾 Lưu toàn bộ dữ liệu
  - 📊 Chuyển sang tab **Analytics** tự động
  - Hiển thị thông báo xác nhận

### **Bước 5: Xem Phân Tích**

Tự động chuyển sang tab **Analytics** với:

- 📈 Biểu đồ chi tiết
- 📋 Thống kê toàn buổi học
- 💡 Gợi ý từ AI

---

## 📊 Dữ Liệu Lưu Trữ

### **Khi Nhấn "End Session"**

Hệ thống lưu:

```json
{
  "session_id": "session_1732601234567",
  "start_time": "2024-11-26T10:00:00Z",
  "end_time": "2024-11-26T10:15:00Z",
  "duration": 900,
  "total_frames": 450,
  "emotion_counts": {
    "Happy": 150,
    "Neutral": 200,
    "Sad": 50,
    "Surprise": 30,
    "Angry": 20,
    "Disgust": 0,
    "Fear": 0
  },
  "timeline": [
    {
      "frame": 0,
      "timestamp": "2024-11-26T10:00:01Z",
      "current_emotion": "Happy",
      "positive_rate": 95,
      "faces": 25,
      "emotion_distribution": {...}
    },
    ...
  ]
}
```

---

## 🎨 Giao Diện Chi Tiết

### **Phía Trái - Video Player**

- 🎬 Hiển thị video/webcam
- ⏱️ Hiển thị thời gian video (chỉ dành cho video file)
- 👁️ **Status Badge**: "Đang nhận diện" khi đang chạy

### **Phía Trái Dưới - Cảm Xúc Hiện Tại**

```
Cảm xúc: Happy
😊 Tích cực: 95%
👥 Khuôn mặt: 25
```

### **Phía Phải - Biểu Đồ**

- Bar chart: Đếm cảm xúc
- Danh sách: Cảm xúc được phát hiện + số lượng
- Tự động cập nhật

---

## ⚙️ Cấu Hình

### **Frame Rate**

- **Webcam**: 2 FPS (capture mỗi 500ms)
- **Video File**: 3 FPS (capture mỗi 300ms)

### **Định Dạng Video Hỗ Trợ**

- ✅ MP4 (H.264)
- ✅ AVI
- ✅ MOV (QuickTime)
- ✅ WebM

### **Kích Thước Video**

- Tối ưu: 640x480 hoặc lớn hơn
- Tự động scale cho phù hợp

---

## 🔍 Các Cảm Xúc Được Nhận Diện

| Cảm Xúc      | Mô Tả                        | Màu Sắc       |
| ------------ | ---------------------------- | ------------- |
| **Happy**    | Vui vẻ, mỉm cười             | 🟢 Xanh       |
| **Sad**      | Buồn, u uẩn                  | 🔵 Xanh dương |
| **Angry**    | Tức giận, cau mày            | 🔴 Đỏ         |
| **Surprise** | Ngạc nhiên, bất ngờ          | 🟡 Vàng       |
| **Neutral**  | Trung lập, không có biểu cảm | ⚫ Xám        |
| **Disgust**  | Ghê tởm, khó chịu            | 🟣 Tím        |
| **Fear**     | Sợ hãi, lo lắng              | 🟠 Cam        |

---

## 🐛 Xử Lý Sự Cố

### **Lỗi: "Không thể truy cập camera"**

- Kiểm tra quyền truy cập webcam
- Đảm bảo không có ứng dụng khác sử dụng camera
- Khởi động lại trình duyệt

### **Lỗi: "Định dạng video không hỗ trợ"**

- Chuyển đổi sang MP4 (định dạng được khuyên dùng nhất)
- Kiểm tra codec (H.264 hoặc VP9)

### **Video không chạy**

- Kiểm tra kết nối mạng
- Đảm bảo backend API đang chạy trên port 8000
- Kiểm tra browser console để xem lỗi

### **Biểu đồ không cập nhật**

- Chờ 1-2 giây (phụ thuộc vào performance)
- Kiểm tra xem API `/monitoring/frame` đang hoạt động

---

## 📝 Ví Dụ Quy Trình Hoàn Chỉnh

1. **Chọn video** → Click "Upload Video" → Chọn file class_recording.mp4
2. **Bắt đầu** → Click "Start Detect"
3. **Theo dõi** → Xem biểu đồ cập nhật real-time
4. **Tạm dừng** → Click "Stop Detect" nếu cần
5. **Tiếp tục** → Click "Start Detect" để tiếp tục
6. **Kết thúc** → Click "End Session"
7. **Phân tích** → Tự động chuyển sang Analytics tab
8. **Xem báo cáo** → Xem chi tiết biểu đồ và gợi ý

---

## 📱 Responsive Design

- ✅ **Desktop**: Bố cục 2 cột (video + biểu đồ)
- ✅ **Tablet**: Bố cục 1 cột (xếp chồng)
- ✅ **Mobile**: Tối ưu cho màn hình nhỏ

---

## 🔐 Bảo Mật

- ✅ Dữ liệu video không được lưu lại trên server
- ✅ Chỉ lưu kết quả phân tích (emotion counts, timeline)
- ✅ Không thu thập dữ liệu cá nhân

---

**Phiên bản**: 1.0  
**Cập nhật**: 2024-11-26  
**Hỗ trợ**: Backend API v2.0+
