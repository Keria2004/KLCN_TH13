import React from "react";

/**
 * Tab navigation cho Analytics
 */
export default function AnalyticsTabs({ activeTab, setActiveTab }) {
  return (
    <ul
      className="nav nav-pills nav-fill gap-2 p-3 mb-0"
      role="tablist"
      style={{ background: "#f8f9fa", borderBottom: "1px solid #e0e0e0" }}
    >
      <li className="nav-item" role="presentation">
        <button
          className={`nav-link fw-bold py-2 ${
            activeTab === "charts" ? "active" : ""
          }`}
          onClick={() => setActiveTab("charts")}
          type="button"
          style={{
            borderRadius: "8px",
            color: activeTab === "charts" ? "white" : "#667eea",
            background:
              activeTab === "charts"
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "transparent",
            border: "none",
            transition: "all 0.3s",
          }}
        >
          <i className="fas fa-chart-bar me-2"></i>Biểu Đồ
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className={`nav-link fw-bold py-2 ${
            activeTab === "table" ? "active" : ""
          }`}
          onClick={() => setActiveTab("table")}
          type="button"
          style={{
            borderRadius: "8px",
            color: activeTab === "table" ? "white" : "#667eea",
            background:
              activeTab === "table"
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "transparent",
            border: "none",
            transition: "all 0.3s",
          }}
        >
          <i className="fas fa-table me-2"></i>Bảng Dữ Liệu
        </button>
      </li>
    </ul>
  );
}
