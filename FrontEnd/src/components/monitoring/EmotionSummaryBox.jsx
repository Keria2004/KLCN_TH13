// src/components/monitoring/EmotionSummaryBox.jsx
export default function EmotionSummaryBox({ emotion, positiveRate }) {
  const safeEmotion = emotion || "Không xác định";
  const safeRate = positiveRate ?? 0;

  return (
    <div>
      <div className="mb-3">
        <span className="text-muted d-block mb-1">Cảm Xúc Hiện Tại</span>
        <span className="fs-4 fw-semibold">
          <i className="fas fa-smile me-2 text-warning"></i>
          {safeEmotion}
        </span>
      </div>

      <div>
        <span className="text-muted d-block mb-1">Tỷ Lệ Cảm Xúc Tích Cực</span>
        <span className="fs-5 fw-semibold">{safeRate}%</span>
      </div>
    </div>
  );
}
