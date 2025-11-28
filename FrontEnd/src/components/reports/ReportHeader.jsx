import "../../styles/reports/ReportHeader.css";

export default function ReportHeader() {
  return (
    <div className="report-header">
      <h2 className="report-title">Báo Cáo Cảm Xúc Lớp Học</h2>

      <div className="report-filters">
        <input type="date" />

        <select>
          <option>Lớp 10A1</option>
          <option>Lớp 10A2</option>
        </select>

        <select>
          <option>Toán</option>
          <option>Vật Lý</option>
        </select>

        <button className="btn-export">Xuất PDF</button>
      </div>
    </div>
  );
}
