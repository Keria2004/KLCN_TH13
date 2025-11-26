import EmotionLineChart from "./EmotionLineChart";

export default function EmotionOverTimeBox({ lineData }) {
  return (
    <div
      className="position-relative"
      style={{ width: "100%", height: "100%" }}
    >
      <EmotionLineChart data={lineData} />
    </div>
  );
}
