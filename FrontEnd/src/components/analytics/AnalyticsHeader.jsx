import React from "react";

/**
 * Header banner cho Analytics page
 */
export default function AnalyticsHeader() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div className="container">
        <h1 className="display-6 fw-bold mb-2">
          <i className="fas fa-chart-line me-2"></i>Phân Tích & Báo Cáo Cảm Xúc
        </h1>
        <p className="lead mb-0" style={{ opacity: 0.9 }}>
          Thống kê chi tiết và báo cáo về cảm xúc lớp học
        </p>
      </div>
    </div>
  );
}
