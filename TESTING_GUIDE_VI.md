# 🧪 Hướng Dẫn Test - Giám Sát Trực Tiếp & Nhận Diện Cảm Xúc Thời Gian Thực

## 📋 Danh Sách Test Cases

Gồm 12+ trường hợp test chi tiết cùng mô tả, bước thực hiện, và tiêu chí đạt.

---

## 🎬 Test 1: Giám Sát Webcam Thời Gian Thực

**Mục đích**: Kiểm tra nhận diện cảm xúc trực tiếp từ webcam

**Bước thực hiện:**

1. Vào tab **"Live Monitoring"**
2. Nhấn nút **"Webcam"** 🎥
3. Đợi camera khởi động
4. Nhấn **"Start Detect"** 🟢
5. Di chuyển khuôn mặt trong camera
6. Quan sát biểu đồ cập nhật
7. Nhấn **"Stop Detect"**

**Tiêu chí đạt:**

- ✅ Video webcam hiển thị
- ✅ Tab Network có POST requests tới `/monitoring/frame`
- ✅ Response status 200
- ✅ Emotion display cập nhật (Happy, Sad, etc.)
- ✅ Positive rate thay đổi (0-100%)
- ✅ Face count cập nhật khi có khuôn mặt
- ✅ Biểu đồ bên phải cập nhật trong vòng 1 giây
- ✅ Không có console errors

**Thời gian**: 3-5 phút

---

## 📹 Test 2: Upload Video File

**Mục đích**: Kiểm tra tải và phân tích video đã ghi hình

**Bước thực hiện:**

1. Chuẩn bị file video (MP4, AVI hoặc MOV) - ít nhất 30 giây
2. Vào tab **"Live Monitoring"**
3. Nhấn **"Upload Video"** 📤
4. Chọn file video
5. Chờ video tải xong
6. Nhấn **"Start Detect"**
7. Xem biểu đồ cập nhật
8. Chờ video kết thúc

**Tiêu chí đạt:**

- ✅ Video file được tải lên
- ✅ Video hiển thị và phát
- ✅ Thanh tiến độ video xuất hiện
- ✅ Request API được gửi
- ✅ Emotion data thu thập được
- ✅ Biểu đồ cập nhật real-time
- ✅ Không có lỗi codec

**Định dạng video hỗ trợ:**

- MP4 (H.264)
- AVI
- MOV (QuickTime)
- WebM

**Thời gian**: 5-10 phút

---

## ⚡ Test 3: Phân Tích Thời Gian Thực Trong Video

**Mục đích**: Kiểm tra frame-by-frame analysis trên video

**Bước thực hiện:**

1. Upload video (từ Test 2)
2. Start Detect
3. Quan sát từng frame:
   - Kiểm tra Tab Network
   - Mỗi 300-500ms có 1 request
4. Xem console logs:
   - "Sending frame to API"
   - "API Response: {emotion, positive_rate, ...}"

**Tiêu chí đạt:**

- ✅ Request được gửi đều đặn
- ✅ Response time < 2 giây/frame
- ✅ Không bị timeout
- ✅ Emotion phát hiện chính xác
- ✅ Biểu đồ cập nhật tức thì
- ✅ Không có request retry

**Thời gian**: 5 phút

---

## 📊 Test 4: Thu Thập Dữ Liệu Timeline

**Mục đích**: Kiểm tra tất cả dữ liệu frame được lưu trữ

**Bước thực hiện:**

1. Start detection (webcam hoặc video)
2. Chạy ít nhất 30 giây
3. Mở DevTools Console
4. Chạy: `window.sessionTimelineRef?.current?.length`
5. Kiểm tra số frame được lưu
6. Xem dữ liệu timeline:
   - Frame number
   - Timestamp
   - Current emotion
   - Positive rate
   - Emotion distribution

**Tiêu chí đạt:**

- ✅ Timeline không trống
- ✅ Tất cả frame có dữ liệu
- ✅ Timestamp tăng dần
- ✅ Emotion labels hợp lệ
- ✅ Positive rate trong khoảng 0-100%
- ✅ Dữ liệu JSON hợp lệ

**Thời gian**: 2-3 phút

---

## 📈 Test 5: Xuất Dữ Liệu tới Analytics

**Mục đích**: Kiểm tra dữ liệu được gửi tới Dashboard phân tích

**Bước thực hiện:**

1. Start detection
2. Chạy ít nhất 50 frame (10-20 giây)
3. Nhấn **"End Session"**
4. Xem alert xác nhận
5. Chờ chuyển tới tab **"Analytics"**

**Tiêu chí đạt:**

- ✅ Alert hiển thị: "Buổi học đã kết thúc!"
- ✅ Tự động chuyển tab Analytics
- ✅ Dashboard hiển thị dữ liệu
- ✅ Số frame phù hợp
- ✅ Emotion counts đúng

**Thời gian**: 2 phút

---

## 📊 Test 6: Analytics Dashboard

**Mục đích**: Kiểm tra biểu đồ và insights

**Bước thực hiện:**

1. Từ Test 5, đã vào tab Analytics
2. Kiểm tra các phần tử:
   - **Bar Chart**: Biểu đồ cảm xúc
   - **Pie Chart**: Tỷ lệ phần trăm cảm xúc
   - **Line Chart**: Tỷ lệ tích cực theo thời gian
   - **AI Insights**: Gợi ý từ AI

**Tiêu chí đạt:**

- ✅ Tất cả biểu đồ hiển thị
- ✅ Dữ liệu chính xác trên biểu đồ
- ✅ Không có NaN hoặc undefined
- ✅ Legend (chú thích) hiển thị đúng
- ✅ Cảm xúc có màu sắc khác nhau
- ✅ AI insights có nội dung ý nghĩa

**Thời gian**: 2-3 phút

---

## ⏹️ Test 7: Dừng Streaming

**Mục đích**: Kiểm tra dừng safe và resource cleanup

**Bước thực hiện:**

1. Start detection
2. Sau 10 giây, nhấn **"Stop Detect"** (vàng)
3. Xem video vẫn chạy
4. Nhấn **"Stop Stream"** (đỏ)
5. Kiểm tra video dừng

**Tiêu chí đạt:**

- ✅ Stop Detect dừng analysis nhưng video vẫn chạy
- ✅ Biểu đồ dừng cập nhật
- ✅ Stop Stream dừng video
- ✅ Không có console errors
- ✅ Có thể Start Detect lại

**Thời gian**: 1-2 phút

---

## 🎬 Test 8: Định Dạng Video Khác Nhau

**Mục đích**: Kiểm tra hỗ trợ nhiều codec video

**Bước thực hiện:**

Thực hiện upload với từng định dạng:

### MP4 (H.264)

```
1. Upload file.mp4
2. Start Detect
3. Xem hoạt động
```

✅ **Dự kiến**: Hoạt động tốt

### AVI

```
1. Upload file.avi
2. Start Detect
3. Xem hoạt động
```

✅ **Dự kiến**: Hoạt động tốt

### MOV

```
1. Upload file.mov
2. Start Detect
3. Xem hoạt động
```

✅ **Dự kiến**: Hoạt động tốt

### WebM

```
1. Upload file.webm
2. Start Detect
3. Xem hoạt động
```

✅ **Dự kiến**: Hoạt động tốt

**Tiêu chí đạt:**

- ✅ Tất cả định dạng được xử lý
- ✅ Không có lỗi codec
- ✅ Analysis hoạt động đúng
- ✅ Performance tương đương

**Thời gian**: 10-15 phút

---

## 🔄 Test 9: Nhiều Phiên Làm Việc

**Mục đích**: Kiểm tra tạo nhiều session không lỗi

**Bước thực hiện:**

1. **Session 1**: Webcam 20 giây → End Session
2. **Session 2**: Upload video → End Session
3. **Session 3**: Webcam 30 giây → End Session

Kiểm tra:

- Tab Network không có lỗi
- Analytics tab cập nhật đúng cho mỗi session
- Dữ liệu không bị xáo trộn

**Tiêu chí đạt:**

- ✅ 3 sessions hoàn thành
- ✅ Mỗi session có dữ liệu riêng
- ✅ Không bị memory leak
- ✅ Console sạch (không có errors)

**Thời gian**: 10-15 phút

---

## ⏳ Test 10: Thời Lượng Dài

**Mục đích**: Kiểm tra xử lý video dài (>5 phút)

**Bước thực hiện:**

1. Chuẩn bị video 10+ phút
2. Upload video
3. Start Detect
4. Chờ video hoàn thành
5. Xem Analytics

**Tiêu chí đạt:**

- ✅ Video chạy hết mà không lag
- ✅ Memory usage ổn định
- ✅ Dữ liệu đúng cho toàn bộ video
- ✅ Analytics hiển thị đúng
- ✅ Không có timeout

**Thời gian**: 15-20 phút (+ thời gian video)

---

## ⚠️ Test 11: Edge Cases

### Case 1: Không có khuôn mặt

```
1. Upload video không có người
2. Start Detect
3. Kiểm tra response
```

**Dự kiến**: Face count = 0, emotion = "Unknown"

### Case 2: Khuôn mặt nhỏ/mờ

```
1. Upload video khuôn mặt ở xa
2. Start Detect
```

**Dự kiến**: Face phát hiện nếu có, emotion có thể lỗi

### Case 3: Ánh sáng kém

```
1. Video quay trong bóng tối
2. Start Detect
```

**Dự kiến**: Face detection yếu, emotion không chính xác

### Case 4: Video clip ngắn (<1 giây)

```
1. Upload video 0.5 giây
2. Start Detect
```

**Dự kiến**: Hoạt động, có ít frame

**Tiêu chí đạt:**

- ✅ Không crash
- ✅ Error message hữu ích
- ✅ Frontend xử lý gracefully

**Thời gian**: 5-10 phút

---

## 🌐 Test 12: Kết Nối Backend

### A: Backend Offline

```
1. Dừng uvicorn server (Ctrl+C)
2. Mở Live Monitoring
3. Click "Start Detect"
4. Xem console
```

**Dự kiến**: Error "Connection refused"

**Fix**: Start backend lại

```bash
cd Backend
uvicorn app.server:app --reload --host 0.0.0.0 --port 8000
```

### B: API Timeout

```
1. Thêm delay vào backend (test purposes)
2. Start Detect
3. Chờ > 30 giây
```

**Dự kiến**: Request timeout, error message

### C: API Response Lỗi

```
1. Gửi frame không hợp lệ
2. Kiểm tra error handling
```

**Dự kiến**: Friendly error, không crash

**Tiêu chí đạt:**

- ✅ Error messages rõ ràng
- ✅ Frontend không crash
- ✅ Có hướng fix

**Thời gian**: 5 phút

---

## 📊 Bảng Kết Quả Test

Sử dụng template này để ghi lại kết quả:

| Test              | Kết Quả | Ghi Chú | Thời Gian |
| ----------------- | ------- | ------- | --------- |
| Test 1: Webcam    | ✅/❌   | ...     | mm:ss     |
| Test 2: Video     | ✅/❌   | ...     | mm:ss     |
| Test 3: Real-time | ✅/❌   | ...     | mm:ss     |
| Test 4: Timeline  | ✅/❌   | ...     | mm:ss     |
| Test 5: Export    | ✅/❌   | ...     | mm:ss     |
| Test 6: Analytics | ✅/❌   | ...     | mm:ss     |
| Test 7: Stop      | ✅/❌   | ...     | mm:ss     |
| Test 8: Formats   | ✅/❌   | ...     | mm:ss     |
| Test 9: Multiple  | ✅/❌   | ...     | mm:ss     |
| Test 10: Long     | ✅/❌   | ...     | mm:ss     |
| Test 11: Edges    | ✅/❌   | ...     | mm:ss     |
| Test 12: Backend  | ✅/❌   | ...     | mm:ss     |

---

## 🎯 Performance Benchmarks

### Mục tiêu:

- **Frame Analysis**: < 1 giây/frame
- **API Response**: < 500ms
- **UI Update**: < 100ms
- **Memory**: < 500MB
- **CPU**: < 50%

### Cách đo:

```javascript
// Console
console.time("frameAnalysis");
// ... analyze
console.timeEnd("frameAnalysis");
```

---

## ✅ Checklist Trước Test

- [ ] Backend đang chạy
- [ ] Frontend khởi động thành công
- [ ] Webcam có quyền truy cập
- [ ] Network tab mở trong DevTools
- [ ] Console tab mở
- [ ] Video test files sẵn sàng
- [ ] Không có lỗi CORS
- [ ] API_BASE_URL đúng

---

## 📝 Ghi Chú

### Ghi Lỗi:

```
Lỗi: [Mô tả lỗi]
Bước tái hiện: [1, 2, 3, ...]
Expected: [Kỳ vọng]
Actual: [Thực tế]
Severity: [Critical/High/Medium/Low]
```

### Ghi Thành Công:

```
Feature: [Tên tính năng]
Hoạt động: ✅
Thời gian: [mm:ss]
Note: [Ghi chú]
```

---

**Phiên bản**: 1.0  
**Cập nhật**: 2024-11-26  
**Ngôn ngữ**: Tiếng Việt

---

## 📚 Tài Liệu Liên Quan

- **DEBUG_GUIDE.md** - Hướng dẫn gỡ lỗi
- **UPLOAD_VIDEO_GUIDE.md** - Hướng dẫn upload video
- **QUICKSTART_VI.md** - Khởi động nhanh
