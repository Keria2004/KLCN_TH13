// src/components/monitoring/EmotionBarBox.jsx
import EmotionBarChart from "./EmotionBarChart";

export default function EmotionBarBox({ data, emotionCounts }) {
  return (
    <div className="h-100 d-flex flex-column">
      {/* Không title ở đây, title đã nằm ở card-header trong MonitorPage */}
      <div className="flex-grow-1 position-relative">
        <EmotionBarChart data={data} emotionCounts={emotionCounts} />
      </div>
    </div>
  );
}
