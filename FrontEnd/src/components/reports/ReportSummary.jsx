import "../../styles/reports/ReportSummary.css";

export default function ReportSummary({ summary }) {
  return (
    <div className="report-summary-grid">
      <div className="summary-card">
        <p className="summary-label">Total Sessions</p>
        <p className="summary-value">{summary.sessions}</p>
      </div>

      <div className="summary-card">
        <p className="summary-label">Avg Positive Rate</p>
        <p className="summary-value">{summary.avgPositive}%</p>
      </div>

      <div className="summary-card">
        <p className="summary-label">Best Session</p>
        <p className="summary-value">{summary.best}</p>
      </div>

      <div className="summary-card">
        <p className="summary-label">Lowest Performance</p>
        <p className="summary-value">{summary.worst}</p>
      </div>
    </div>
  );
}
