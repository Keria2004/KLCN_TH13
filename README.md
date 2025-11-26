1. Mục tiêu của hệ thống

Hệ thống nhằm mục đích:

Giám sát cảm xúc tổng thể của lớp học trong một buổi học thông qua camera.

Phân tích biểu cảm khuôn mặt bằng mô hình Deep Learning (FER – Facial Emotion Recognition).

Trực quan hóa cảm xúc theo thời gian, phân bố cảm xúc, và cảm xúc nổi bật.

Hỗ trợ giáo viên đánh giá mức độ hứng thú của lớp trong lúc dạy.

📌 Không bao gồm:
❌ Ứng dụng phụ huynh
❌ Theo dõi từng học sinh riêng lẻ
❌ Quản lý danh sách học sinh
❌ Hồ sơ học sinh

➡ Đây là phiên bản demo dành cho 1 buổi học chung.

🏗️ 2. Kiến trúc tổng quan
Camera / Video Input
│
▼
Backend (FastAPI + OpenCV + Deep Learning Model)
│
│ Trả về timeline cảm xúc
▼
Frontend (React)
├── Live Camera / Video Player
├── Real-time Charts
├── Emotion Summary
└── Emotion Over Time

Thành phần:
Thành phần Công nghệ Chức năng
Frontend React.js Upload video, xem camera, hiển thị biểu đồ
Backend API FastAPI Nhận video, phân tích từng frame
AI Model PyTorch/TensorFlow Nhận diện cảm xúc
Processing OpenCV Tách frame, tiền xử lý hình ảnh
😎 3. Chức năng chính
✔ 3.1 Giám sát bằng camera hoặc video

Kết nối webcam trực tiếp từ trình duyệt

Hoặc upload video (mp4/avi)

Server phân tích cảm xúc frame-by-frame

✔ 3.2 Phân tích cảm xúc

Hệ thống nhận diện các cảm xúc:

Happy 😄

Sad 😢

Angry 😡

Surprise 😲

Neutral 😐

Disgust 😖

Fear 😨

✔ 3.3 Dashboard trực quan

Emotion Summary – cảm xúc chính + tỷ lệ tích cực

Emotion Distribution – biểu đồ cột

Emotion Over Time – biểu đồ đường

Teaching Insights (demo) – gợi ý giảng dạy dựa trên cảm xúc chung

✔ 3.4 Phân tích sau buổi học (Analytics)

Tổng số mẫu cảm xúc thu thập

Biểu đồ phân bố cảm xúc

Biểu đồ xu hướng cảm xúc theo thời gian

Gợi ý cải thiện bài giảng

✔ 3.5 Export dữ liệu (demo)

Xuất CSV báo cáo buổi học

⚙️ 4. Yêu cầu hệ thống
Backend

Python 3.10+

FastAPI

Uvicorn

OpenCV

PyTorch / TensorFlow

NumPy

Frontend

Node.js 16+

React 18

Chart.js hoặc Recharts
