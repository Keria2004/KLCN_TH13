import "../../styles/reports/ReportHeader.css";

export default function ReportHeader() {
  return (
    <div className="report-header">
      <h2 className="report-title">Class Emotion Reports</h2>

      <div className="report-filters">
        <input type="date" />

        <select>
          <option>Class 10A1</option>
          <option>Class 10A2</option>
        </select>

        <select>
          <option>Math</option>
          <option>Physics</option>
        </select>

        <button className="btn-export">Export PDF</button>
      </div>
    </div>
  );
}
