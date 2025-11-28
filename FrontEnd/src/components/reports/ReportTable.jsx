import "../../styles/reports/ReportTable.css";

export default function ReportTable({ rows }) {
  return (
    <div className="report-table-container">
      <table className="report-table">
        <thead>
          <tr>
            <th>Thời Gian</th>
            <th>Tỷ Lệ Tích Cực</th>
            <th>Cảm Xúc Chủ Đạo</th>
            <th>Ghi Chú</th>
            <th>Tệp</th>
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
                <button className="btn-view">Xem</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
