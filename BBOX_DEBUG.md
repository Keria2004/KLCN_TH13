# 🔧 Debug: Bounding Box Bị Lệch

## Nguyên Nhân & Giải Pháp

### ✅ Đã Fix: Scale Factor

**Vấn đề:**

- Backend trả bbox trong kích thước frame gốc (ví dụ: 640x480)
- Frontend video display có thể scale khác (ví dụ: 320x240 trên UI)
- Bbox không scale theo → **bị lệch**

**Giải Pháp:**

```javascript
// Tính scale factor
const videoWidth = video.videoWidth; // Frame gốc: 640
const videoHeight = video.videoHeight; // Frame gốc: 480
const displayWidth = video.offsetWidth; // Display: 320
const displayHeight = video.offsetHeight; // Display: 240

const scaleX = displayWidth / videoWidth; // 0.5
const scaleY = displayHeight / videoHeight; // 0.5

// Áp dụng scale
const scaledX = x1 * scaleX;
const scaledY = y1 * scaleY;
const scaledWidth = (x2 - x1) * scaleX;
const scaledHeight = (y2 - y1) * scaleY;
```

## Kỹ Thuật Chi Tiết

### 1. **Canvas vs Display Size**

```
┌─ video.videoWidth/Height (metadata size)
│  └─ Frame thực từ camera/video (ví dụ: 640x480)
│
└─ video.offsetWidth/Height (display size)
   └─ Kích thước hiển thị trên UI (ví dụ: 320x240)

Canvas phải set bằng offsetWidth/Height để match display!
```

### 2. **Bounding Box Scaling**

Backend trả tọa độ dựa trên `videoWidth x videoHeight`:

```python
# Backend (emotion_service.py)
x1, y1, x2, y2 = map(int, box.xyxy[0])  # 0-640, 0-480
faces_output.append({
    "bbox": [x1, y1, x2, y2]
})
```

Frontend phải scale lên display size:

```javascript
// Frontend (LiveMonitoring.jsx)
const [x1, y1, x2, y2] = face.bbox; // 0-640, 0-480
const scaledX = x1 * scaleX; // 0-320
const scaledY = y1 * scaleY; // 0-240
const scaledW = (x2 - x1) * scaleX; // 0-320
const scaledH = (y2 - y1) * scaleY; // 0-240
```

### 3. **Fallback untuk Metadata Belum Load**

Kali pertama webcam start, `videoWidth` mungkin belum siap:

```javascript
let videoWidth = video.videoWidth;
let videoHeight = video.videoHeight;

// Fallback jika belum ready
if (!videoWidth || !videoHeight) {
  videoWidth = video.offsetWidth || 640;
  videoHeight = video.offsetHeight || 480;
}
```

## Testing Guide

### Test 1: Resize Window

1. Buka monitor page
2. Start webcam & detect
3. **Ubah kích thước browser window**
4. ✅ Bounding box phải **vẫn sát** khuôn mặt

### Test 2: Different Video Sizes

1. Upload video 1920x1080
2. Xem bbox có sát không
3. Upload video 640x480
4. Xem bbox có sát không

### Test 3: Canvas Logging

Thêm vào browser console:

```javascript
// In browser console (F12)
const video = document.querySelector("video");
const canvas = document.querySelectorAll("canvas")[1]; // overlay canvas

console.log("Video metadata:", video.videoWidth, "x", video.videoHeight);
console.log("Video display:", video.offsetWidth, "x", video.offsetHeight);
console.log("Canvas size:", canvas.width, "x", canvas.height);
console.log(
  "Scale:",
  video.offsetWidth / video.videoWidth,
  "x",
  video.offsetHeight / video.videoHeight
);
```

## Performance Tips

✅ **Tối ưu hóa:**

- Scale factor tính mỗi frame (không cache) vì display size có thể đổi
- Line width tỷ lệ với scale: `ctx.lineWidth = 3 * Math.min(scaleX, scaleY)`
- Font size tỷ lệ: `fontSize * Math.min(scaleX, scaleY)`

## Comparison: Before & After

### ❌ Before (Lệch)

```
Backend: bbox = [100, 100, 200, 200]  (khung mặt trên frame 640x480)
Canvas size = 640x480
Display size = 320x240
→ Vẽ ở (100, 100) nhưng display scale 0.5
→ BỊ LỆCH 50%!
```

### ✅ After (Sát)

```
Backend: bbox = [100, 100, 200, 200]
Canvas size = 320x240 (match display)
Video scale = 0.5
Scaled bbox = [50, 50, 100, 100]  ← scale đúng
→ VẼ CHÍNH XÁC!
```

## Commit Message

```
🎯 Fix: Bounding box lệch do không scale với display size

- Tính scaleX, scaleY từ video.videoWidth vs video.offsetWidth
- Áp dụng scale cho bbox từ backend
- Canvas size = display size (offsetWidth/Height)
- Font & lineWidth tỷ lệ với scale
- Fallback nếu metadata chưa load
```
