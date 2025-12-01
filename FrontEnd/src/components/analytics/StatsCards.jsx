import React from "react";

/**
 * Stat cards hiển thị metrics
 */
export default function StatsCards({ engagement, positive, dominantEmotion }) {
  return (
    <div className="row mb-4 g-3">
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
              Mức Độ Hứng Thú
            </h6>
            <h3 style={{ color: "#667eea" }} className="fw-bold">
              {engagement}%
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
              Tỷ Lệ Tích Cực
            </h6>
            <h3 style={{ color: "#28a745" }} className="fw-bold">
              {positive}%
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
            <h3 style={{ color: "#764ba2" }} className="fw-bold text-truncate">
              {dominantEmotion}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
