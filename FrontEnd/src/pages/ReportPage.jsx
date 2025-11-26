export default function ReportPage() {
  // Sau này bạn có thể lấy danh sách tất cả các lớp, export PDF, v.v.
  return (
    <div className="row mt-4">
      <div className="col-md-12">
        <h3 className="mb-3">
          <i className="fas fa-file-alt me-2"></i>Class Reports
        </h3>
        <p className="text-muted">
          Tổng hợp các buổi học, thống kê cảm xúc & hiệu quả giảng dạy.
        </p>

        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Report List</span>
            <button className="btn btn-sm btn-outline-primary">
              <i className="fas fa-download me-1"></i>Export CSV
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Dominant Emotion</th>
                    <th>Avg. Students</th>
                    <th>Duration</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Demo row */}
                  <tr>
                    <td>2025-11-01</td>
                    <td>Math</td>
                    <td>T123</td>
                    <td>
                      <span className="badge bg-warning">
                        <i className="fas fa-smile me-1"></i>Happy
                      </span>
                    </td>
                    <td>28.5</td>
                    <td>45 min</td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary">
                        View
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      (Thay dữ liệu demo bằng API thật của bạn)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
