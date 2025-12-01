import React from "react";
import EmotionBarBox from "../monitoring/EmotionBarBox";
import EmotionOverTimeBox from "../monitoring/EmotionOverTimeBox";

/**
 * Charts section
 */
export default function ChartsSection({
  barData,
  lineData,
  sessions,
  selectedSession,
  exporting,
  onExportPDF,
  onExportCSV,
  onExportJSON,
  onSelectSession,
}) {
  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-6">
          <h5 style={{ color: "#667eea" }} className="fw-bold">
            {selectedSession?.subject || "Môn Học Demo"}
          </h5>
          <p className="text-muted small">
            <i className="fas fa-user me-1"></i>ID Giáo Viên:{" "}
            {selectedSession?.teacher_id || "T123"}
          </p>
        </div>
        <div className="col-md-6 text-end">
          <div className="btn-group gap-2">
            <button
              className="btn btn-sm"
              onClick={onExportPDF}
              disabled={exporting}
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
              className="btn btn-sm"
              onClick={onExportCSV}
              disabled={exporting}
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              <i className="fas fa-file-csv me-1"></i>CSV
            </button>
            <button
              className="btn btn-sm"
              onClick={onExportJSON}
              disabled={exporting}
              style={{
                background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              <i className="fas fa-file-code me-1"></i>JSON
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "12px", minHeight: 360 }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "15px",
              }}
            >
              <h6 className="mb-0">📊 Phân Phối Cảm Xúc</h6>
            </div>
            <div className="card-body">
              <EmotionBarBox
                data={barData}
                emotionCounts={{
                  Happy: barData[0] || 0,
                  Sad: barData[1] || 0,
                  Angry: barData[2] || 0,
                  Surprise: barData[3] || 0,
                  Neutral: barData[4] || 0,
                  Disgust: barData[5] || 0,
                  Fear: barData[6] || 0,
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "12px", minHeight: 360 }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "white",
                padding: "15px",
              }}
            >
              <h6 className="mb-0">📊 Cảm Xúc Theo Thời Gian</h6>
            </div>
            <div className="card-body">
              <EmotionOverTimeBox lineData={lineData} />
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length > 0 && (
        <div className="mt-4">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "12px" }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #0dcaf0 0%, #00d4ff 100%)",
                color: "white",
                padding: "15px",
              }}
            >
              <h6 className="mb-0">📚 Buổi Học Gần Đây</h6>
            </div>
            <div className="card-body">
              <div className="list-group">
                {sessions.slice(0, 5).map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${
                      selectedSession?.id === session.id ? "active" : ""
                    }`}
                    onClick={() => onSelectSession(session.id)}
                    style={{
                      borderLeft:
                        selectedSession?.id === session.id
                          ? "4px solid #667eea"
                          : "none",
                    }}
                  >
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <h6 className="mb-1 fw-bold">{session.subject}</h6>
                      <small className="text-muted">
                        {new Date(session.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </small>
                    </div>
                    <p className="mb-0 text-muted small">
                      <i className="fas fa-id-card me-1"></i>ID: {session.id}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
