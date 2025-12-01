import React from "react";

/**
 * Breadcrumb navigation
 */
export default function BreadcrumbNav() {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol
        className="breadcrumb"
        style={{ background: "transparent", padding: 0 }}
      >
        <li className="breadcrumb-item">
          <a href="/" style={{ color: "#667eea" }}>
            Trang Chủ
          </a>
        </li>
        <li className="breadcrumb-item">
          <a href="/monitor" style={{ color: "#667eea" }}>
            Giám Sát
          </a>
        </li>
        <li className="breadcrumb-item active" style={{ color: "#764ba2" }}>
          Phân Tích & Báo Cáo
        </li>
      </ol>
    </nav>
  );
}
