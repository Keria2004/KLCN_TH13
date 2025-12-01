import React from "react";

/**
 * Table section cho Analytics
 */
export default function TableSection({
  filteredSessions,
  allSessions,
  filterSubject,
  filterStatus,
  onFilterSubjectChange,
  onFilterStatusChange,
  onExportPDF,
  onExportCSV,
  exporting,
  getEmotionBadgeColor,
}) {
  const allSubjects = [...new Set(allSessions.map((s) => s.subject))].filter(
    Boolean
  );

  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Môn Học</label>
          <select
            className="form-select"
            value={filterSubject}
            onChange={(e) => onFilterSubjectChange(e.target.value)}
            style={{ borderRadius: "8px" }}
          >
            <option value="all">Tất Cả Môn Học</option>
            {allSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Trạng Thái</label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
            style={{ borderRadius: "8px" }}
          >
            <option value="all">Tất Cả Trạng Thái</option>
            <option value="active">Đang Hoạt Động</option>
            <option value="closed">Đã Đóng</option>
          </select>
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <div className="gap-2 w-100 d-flex">
            <button
              className="btn w-100 fw-bold"
              onClick={onExportPDF}
              disabled={exporting || filteredSessions.length === 0}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              <i className="fas fa-file-pdf me-1"></i>PDF
            </button>
            <button
              className="btn w-100 fw-bold"
              onClick={onExportCSV}
              disabled={exporting || filteredSessions.length === 0}
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              <i className="fas fa-file-csv me-1"></i>CSV
            </button>
          </div>
        </div>
      </div>

      <div className="alert alert-info mb-3" style={{ borderRadius: "8px" }}>
        <small>
          <i className="fas fa-info-circle me-2"></i>Showing{" "}
          {filteredSessions.length} of {allSessions.length} sessions
        </small>
      </div>

      {/* Table */}
      {filteredSessions.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="fas fa-inbox fa-3x mb-3" style={{ color: "#ccc" }}></i>
          <p className="fw-bold">Không Tìm Thấy Buổi Học</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead style={{ background: "#f8f9fa" }}>
              <tr>
                <th style={{ color: "#667eea", fontWeight: "bold" }}>Ngày</th>
                <th style={{ color: "#667eea", fontWeight: "bold" }}>
                  Môn Học
                </th>
                <th style={{ color: "#667eea", fontWeight: "bold" }}>
                  Giáo Viên
                </th>
                <th style={{ color: "#667eea", fontWeight: "bold" }}>
                  Cảm Xúc Chủ Đạo
                </th>
                <th style={{ color: "#667eea", fontWeight: "bold" }}>
                  Tỷ Lệ Tích Cực
                </th>
                <th style={{ color: "#667eea", fontWeight: "bold" }}>
                  Trạng Thái
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => (
                <tr
                  key={session.id}
                  style={{ borderBottom: "1px solid #e0e0e0" }}
                >
                  <td>
                    <small className="text-muted">
                      {new Date(session.created_at).toLocaleDateString("vi-VN")}
                    </small>
                  </td>
                  <td>
                    <strong>{session.subject || "N/A"}</strong>
                  </td>
                  <td>
                    <code style={{ color: "#667eea" }}>
                      {session.teacher_name ||
                        `T${session.teacher_id}` ||
                        "N/A"}
                    </code>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${getEmotionBadgeColor(
                        session.dominantEmotion
                      )}`}
                      style={{ color: "white" }}
                    >
                      {session.dominantEmotion}
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold" style={{ color: "#28a745" }}>
                      {session.positiveRate}%
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        session.status === "closed"
                          ? "bg-success"
                          : "bg-warning"
                      }`}
                      style={{ color: "white" }}
                    >
                      {session.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary cards */}
      {filteredSessions.length > 0 && (
        <div className="row g-3 mt-4">
          <div className="col-lg-3 col-md-6">
            <div
              className="card shadow-sm border-0 text-center h-100"
              style={{
                borderRadius: "10px",
                borderTop: "4px solid #667eea",
              }}
            >
              <div className="card-body">
                <h6 className="card-title text-muted fw-bold mb-2">
                  Tổng Số Buổi Học
                </h6>
                <h3 style={{ color: "#667eea" }} className="fw-bold">
                  {filteredSessions.length}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div
              className="card shadow-sm border-0 text-center h-100"
              style={{
                borderRadius: "10px",
                borderTop: "4px solid #28a745",
              }}
            >
              <div className="card-body">
                <h6 className="card-title text-muted fw-bold mb-2">
                  Trung Bình Tích Cực
                </h6>
                <h3 style={{ color: "#28a745" }} className="fw-bold">
                  {(
                    filteredSessions.reduce(
                      (sum, s) => sum + parseFloat(s.positiveRate || 0),
                      0
                    ) / filteredSessions.length
                  ).toFixed(1)}
                  %
                </h3>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div
              className="card shadow-sm border-0 text-center h-100"
              style={{
                borderRadius: "10px",
                borderTop: "4px solid #764ba2",
              }}
            >
              <div className="card-body">
                <h6 className="card-title text-muted fw-bold mb-2">
                  Cảm Xúc Chủ Đạo
                </h6>
                <h3 style={{ color: "#764ba2" }} className="fw-bold">
                  {Object.entries(
                    filteredSessions.reduce((acc, s) => {
                      acc[s.dominantEmotion] =
                        (acc[s.dominantEmotion] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
