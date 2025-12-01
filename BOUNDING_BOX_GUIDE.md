# 🎯 Hướng Dẫn Hiển Thị Bounding Box Trên Video

## Cách Hoạt Động

### 1. **Backend (emotion_service.py)**

Backend nhận frame từ frontend → phân tích → trả về:

```python
{
  "faces": [
    {
      "bbox": [x1, y1, x2, y2],      # Tọa độ góc trái-trên (x1,y1) đến góc phải-dưới (x2,y2)
      "emotion": "Happy",             # Cảm xúc nhận diện
      "confidence": 0.95              # Độ tin cậy
    }
  ],
  "emotion_distribution": {...},
  "current_emotion": "Happy",
  "positive_rate": 85
}
```

### 2. **Frontend (LiveMonitoring.jsx)**

#### **Step 1: Nhận Response**

```javascript
// Trong analyzeVideo(), khi API trả về response:
faceDetectionsRef.current = faces || []; // Lưu faces vào ref
setFaceCount(faces ? faces.length : 0); // Cập nhật số khuôn mặt
```

#### **Step 2: Canvas Overlay**

```jsx
// Canvas overlay được đặt ngay trên video element
<canvas
  ref={overlayCanvasRef}
  className="video-display"
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: isDetecting ? "block" : "none",
    cursor: "crosshair",
  }}
/>
```

#### **Step 3: Animation Loop (requestAnimationFrame)**

```javascript
// useEffect vẽ bounding box liên tục
const drawFrame = () => {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  // Cập nhật canvas size
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  // Xóa canvas cũ
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vẽ từng face
  faceDetectionsRef.current.forEach((face) => {
    const [x1, y1, x2, y2] = face.bbox; // Backend format
    const width = x2 - x1;
    const height = y2 - y1;

    // Vẽ rectangle
    ctx.strokeStyle = getEmotionColor(face.emotion); // Màu theo cảm xúc
    ctx.lineWidth = 3;
    ctx.strokeRect(x1, y1, width, height);

    // Vẽ text
    ctx.fillText(face.emotion, x1 + 5, y1 - 5);
    ctx.fillText(
      `${(face.confidence * 100).toFixed(0)}%`,
      x1 + 5,
      y1 + height + 15
    );
  });

  // Tiếp tục vòng lặp
  animationFrameId = requestAnimationFrame(drawFrame);
};
```

### 3. **Màu Sắc Theo Cảm Xúc**

```javascript
const getEmotionColor = (emotion) => {
  const colors = {
    Happy: "#28a745", // 🟢 Xanh
    Surprise: "#ffc107", // 🟡 Vàng
    Neutral: "#6c757d", // ⚫ Xám
    Sad: "#007bff", // 🔵 Xanh dương
    Angry: "#dc3545", // 🔴 Đỏ
    Disgust: "#e83e8c", // 💜 Tím
    Fear: "#fd7e14", // 🟠 Cam
  };
  return colors[emotion] || "#6c757d";
};
```

## CSS Cần Thiết

```css
.video-wrapper {
  position: relative; /* ⭐ QUAN TRỌNG: overlay canvas cần relative parent */
  width: 100%;
  padding-bottom: 75%; /* Aspect ratio 4:3 */
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

.video-display {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

canvas.video-display {
  z-index: 10; /* Canvas nằm trên video */
  pointer-events: none; /* Canvas không block click */
}
```

## Flow Diagram

```
┌─────────────────────┐
│   FE LiveMonitoring │
│   ├─ Video Element  │
│   ├─ Canvas Overlay │◄──────────┐
│   └─ analyzeVideo() │           │
└──────────┬──────────┘           │
           │                      │
           ▼ POST /frame          │
┌─────────────────────┐           │
│  BE /monitoring     │           │
│  - Face Detection   │           │
│  - Emotion Classify │           │
│  - Return faces[]   │           │
└──────────┬──────────┘           │
           │                      │
           └──────►faceDetectionsRef.current
                  ├─ bbox: [x1,y1,x2,y2]
                  ├─ emotion: "Happy"
                  └─ confidence: 0.95

                  requestAnimationFrame(drawFrame)
                  ├─ Clear canvas
                  ├─ Loop faces
                  ├─ Draw rectangle
                  ├─ Draw text
                  └─ Schedule next frame ──┐
                                           │
                                           └──► Loop (60 FPS)
```

## Troubleshooting

| Vấn đề                  | Nguyên Nhân                 | Giải Pháp                                          |
| ----------------------- | --------------------------- | -------------------------------------------------- |
| Không thấy bounding box | Canvas không visible        | Kiểm tra `display: isDetecting ? "block" : "none"` |
| Box không quay lên      | video.videoWidth chưa ready | Dùng `video.offsetWidth` as fallback               |
| Box không theo video    | Canvas size sai             | Kiểm tra `canvas.width = videoWidth`               |
| Box bị chậm             | FPS thấp                    | Reduce detection interval trong `analyzeVideo()`   |
| Text không hiển thị     | Font size quá nhỏ           | Tăng font size hoặc ctx.font size                  |

## Testing

1. **Start Webcam** → Click "Bắt Đầu Giám Sát"
2. **Wait 2-3 seconds** → Bounding box sẽ xuất hiện
3. **Move face** → Box sẽ follow movement
4. **Change expression** → Color sẽ thay đổi theo cảm xúc

## Performance Tips

- ✅ Frame-based detection (mỗi 2-3 frame) thay vì mỗi frame
- ✅ Lưu faces trong ref thay vì state (tránh re-render)
- ✅ Dùng requestAnimationFrame thay vì setInterval
- ✅ Canvas size chỉ update khi cần thiết
- ✅ Clear canvas một lần, vẽ tất cả boxes cùng lúc
