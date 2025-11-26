import "../../styles/reports/ReportTable.css";

export default function ReportTable({ rows }) {
  return (
    <div className="report-table-container">
      <table className="report-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Positive Rate</th>
            <th>Dominant Emotion</th>
            <th>Notes</th>
            <th>File</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td>{r.time}</td>
              <td>{r.positive}%</td>
              <td>{r.emotion}</td>
              <td>{r.note}</td>
              <td>
                <button className="btn-view">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
