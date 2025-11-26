import "../../styles/analytics/AnalyticsHeader.css";

export default function AnalyticsHeader() {
  return (
    <div className="analytics-header">
      <h2 className="analytics-title">Emotion Analytics Dashboard</h2>

      <div className="analytics-filters">
        <select>
          <option>Math</option>
          <option>Physics</option>
          <option>English</option>
        </select>

        <select>
          <option>Class 10A1</option>
          <option>Class 10A2</option>
        </select>

        <input type="date" />

        <button className="download-btn">Download Report</button>
      </div>
    </div>
  );
}
