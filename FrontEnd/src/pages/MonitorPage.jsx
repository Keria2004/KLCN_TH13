import React, { useState } from "react";
import LiveMonitoring from "../components/monitoring/LiveMonitoring";
import VideoUpload from "../components/monitoring/VideoUpload";
import EmotionBarBox from "../components/monitoring/EmotionBarBox";

const MonitorPage = () => {
  const [activeTab, setActiveTab] = useState("live");
  const [emotionData, setEmotionData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [currentEmotion, setCurrentEmotion] = useState("Bình thường");
  const [stats, setStats] = useState({
    engagement: 0,
    positive: 0,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [boredRate, setBoredRate] = useState(0);

  // Tính toán tỷ lệ chán nản: (Sad + Angry + Disgust + Fear) / Total
  const calculateBoredRate = (data) => {
    if (!data || data.length === 0) return 0;
    const total = data.reduce((a, b) => a + b, 0) || 1;
    const boredEmotions =
      (data[1] || 0) + (data[2] || 0) + (data[5] || 0) + (data[6] || 0);
    return Math.round((boredEmotions / total) * 100);
  };

  return (
    <div className="min-vh-100" style={{ background: "#f8f9fa" }}>
      {/* Alert Thông báo Chán Nản */}
      {showAlert && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            animation: "slideIn 0.3s ease-in-out",
          }}
        >
          <div
            className="alert alert-warning alert-dismissible fade show"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: "none",
              background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
              color: "white",
              minWidth: "350px",
            }}
            role="alert"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <i
                className="fas fa-exclamation-circle"
                style={{ fontSize: "24px", flexShrink: 0 }}
              ></i>
              <div>
                <strong>⚠️ Cảnh báo!</strong>
                <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                  Tỷ lệ học sinh chán nản đạt <strong>{boredRate}%</strong>
                </p>
                <small style={{ opacity: 0.9 }}>
                  Hãy thay đổi phương pháp dạy hoặc tăng tương tác
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              style={{ filter: "brightness(0) invert(1)" }}
              onClick={() => setShowAlert(false)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "40px 20px",
        }}
      >
        <div className="container">
          <h1 className="display-6 fw-bold mb-2">
            <i className="fas fa-video me-2"></i>Hệ Thống Giám Sát Cảm Xúc
          </h1>
          <p className="lead mb-0" style={{ opacity: 0.9 }}>
            Giám sát và phân tích cảm xúc lớp học theo thời gian thực
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-4">
        {/* Tab Navigation */}
        <ul
          className="nav nav-pills nav-fill gap-2 mb-4"
          role="tablist"
          style={{ borderBottom: "none" }}
        >
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link fw-bold py-2 ${
                activeTab === "live" ? "active" : ""
              }`}
              onClick={() => setActiveTab("live")}
              type="button"
              role="tab"
              style={{
                borderRadius: "8px",
                color: activeTab === "live" ? "white" : "#667eea",
                background:
                  activeTab === "live"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "#f0f0f0",
                border: "none",
                transition: "all 0.3s",
              }}
            >
              <i className="fas fa-video me-2"></i>Giám Sát Trực Tiếp
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link fw-bold py-2 ${
                activeTab === "upload" ? "active" : ""
              }`}
              onClick={() => setActiveTab("upload")}
              type="button"
              role="tab"
              style={{
                borderRadius: "8px",
                color: activeTab === "upload" ? "white" : "#667eea",
                background:
                  activeTab === "upload"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "#f0f0f0",
                border: "none",
                transition: "all 0.3s",
              }}
            >
              <i className="fas fa-upload me-2"></i>Tải Lên Video
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="row g-4 mb-4">
          {/* Left: Monitoring */}
          <div className="col-lg-8">
            <div className="tab-content">
              {/* Live Monitoring Tab */}
              <div
                className={`tab-pane fade ${
                  activeTab === "live" ? "show active" : ""
                }`}
                role="tabpanel"
              >
                <div
                  className="card shadow-sm border-0"
                  style={{ borderRadius: "12px" }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: "20px",
                    }}
                  >
                    <h5 className="mb-0">
                      <i className="fas fa-video me-2"></i>Giám Sát Trực Tiếp
                    </h5>
                  </div>
                  <div className="card-body">
                    <LiveMonitoring
                      onEmotionUpdate={(data, emotion, stats) => {
                        setEmotionData(data);
                        setCurrentEmotion(emotion);
                        setStats(stats);

                        // 🔔 Kiểm tra tỷ lệ chán nản
                        const newBoredRate = calculateBoredRate(data);
                        setBoredRate(newBoredRate);
                        if (newBoredRate >= 40) {
                          setShowAlert(true);
                        } else {
                          setShowAlert(false);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Video Upload Tab */}
              <div
                className={`tab-pane fade ${
                  activeTab === "upload" ? "show active" : ""
                }`}
                role="tabpanel"
              >
                <div
                  className="card shadow-sm border-0"
                  style={{ borderRadius: "12px" }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: "20px",
                    }}
                  >
                    <h5 className="mb-0">
                      <i className="fas fa-upload me-2"></i>Tải Lên Video
                    </h5>
                  </div>
                  <div className="card-body">
                    <VideoUpload
                      onEmotionUpdate={(data, emotion, stats) => {
                        setEmotionData(data);
                        setCurrentEmotion(emotion);
                        setStats(stats);

                        // 🔔 Kiểm tra tỷ lệ chán nản
                        const newBoredRate = calculateBoredRate(data);
                        setBoredRate(newBoredRate);
                        if (newBoredRate >= 40) {
                          setShowAlert(true);
                        } else {
                          setShowAlert(false);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Analytics Charts */}
          <div className="col-lg-4">
            <div className="row g-3 h-100">
              {/* Emotion Stats */}
              <div className="col-12">
                <div
                  className="card shadow-sm border-0 h-100"
                  style={{ borderRadius: "12px" }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: "15px",
                    }}
                  >
                    <h6 className="mb-0">
                      <i className="fas fa-chart-bar me-2"></i>Thống Kê Cảm Xúc
                    </h6>
                  </div>
                  <div className="card-body p-3">
                    <EmotionBarBox
                      data={emotionData}
                      emotionCounts={{
                        Happy: emotionData[0] || 0,
                        Sad: emotionData[1] || 0,
                        Angry: emotionData[2] || 0,
                        Surprise: emotionData[3] || 0,
                        Neutral: emotionData[4] || 0,
                        Disgust: emotionData[5] || 0,
                        Fear: emotionData[6] || 0,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="col-12">
                <div
                  className="card shadow-sm border-0"
                  style={{ borderRadius: "12px" }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      color: "white",
                      padding: "15px",
                    }}
                  >
                    <h6 className="mb-0">
                      <i className="fas fa-gauge me-2"></i>Chỉ Số Hiệu Suất
                    </h6>
                  </div>
                  <div className="card-body p-3">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="fw-bold" style={{ color: "#667eea" }}>
                          Hứng Thú
                        </small>
                        <small className="fw-bold">{stats.engagement}%</small>
                      </div>
                      <div
                        className="progress"
                        style={{ height: "8px", borderRadius: "4px" }}
                      >
                        <div
                          className="progress-bar"
                          style={{
                            background:
                              "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                            width: `${stats.engagement}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="fw-bold" style={{ color: "#28a745" }}>
                          Tích Cực
                        </small>
                        <small className="fw-bold">{stats.positive}%</small>
                      </div>
                      <div
                        className="progress"
                        style={{ height: "8px", borderRadius: "4px" }}
                      >
                        <div
                          className="progress-bar"
                          style={{
                            background:
                              "linear-gradient(90deg, #28a745 0%, #20c997 100%)",
                            width: `${stats.positive}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Emotion Badge */}
              <div className="col-12">
                <div
                  className="card shadow-sm border-0 text-center"
                  style={{
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <div className="card-body text-white">
                    <small className="d-block mb-2 opacity-75">
                      CẢMXÚC HIỆN TẠI
                    </small>
                    <h4 className="fw-bold mb-0">{currentEmotion}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="row g-3 mt-2">
          <div className="col-lg-6">
            <div
              className="card shadow-sm border-0 h-100"
              style={{ borderRadius: "12px", borderLeft: "4px solid #667eea" }}
            >
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">
                  <i
                    className="fas fa-lightbulb me-2"
                    style={{ color: "#ffc107" }}
                  ></i>
                  Mẹo
                </h5>
                <ul className="small mb-0 ps-3">
                  <li className="mb-2">
                    Sử dụng giám sát trực tiếp để theo dõi thay đổi cảm xúc thời
                    gian thực
                  </li>
                  <li className="mb-2">
                    Tải lên video đã ghi hình để phân tích chi tiết
                  </li>
                  <li>Kiểm tra phân tích để hiểu rõ tâm trạng chung của lớp</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div
              className="card shadow-sm border-0 h-100"
              style={{ borderRadius: "12px", borderLeft: "4px solid #764ba2" }}
            >
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">
                  <i
                    className="fas fa-face-smile me-2"
                    style={{ color: "#667eea" }}
                  ></i>
                  Cảm Xúc Được Nhận Diện
                </h5>
                <div className="small d-flex flex-wrap gap-2">
                  <span
                    className="badge rounded-pill"
                    style={{ background: "#28a745" }}
                  >
                    😄 Vui vẻ
                  </span>
                  <span
                    className="badge rounded-pill"
                    style={{ background: "#ffc107", color: "black" }}
                  >
                    😲 Ngạc nhiên
                  </span>
                  <span
                    className="badge rounded-pill"
                    style={{ background: "#6c757d" }}
                  >
                    😐 Bình thường
                  </span>
                  <span
                    className="badge rounded-pill"
                    style={{ background: "#0d6efd" }}
                  >
                    😢 Buồn
                  </span>
                  <span
                    className="badge rounded-pill"
                    style={{ background: "#dc3545" }}
                  >
                    😡 Giận dữ
                  </span>
                  <span
                    className="badge rounded-pill"
                    style={{ background: "#20c997" }}
                  >
                    😖 Ghê tởm
                  </span>
                  <span
                    className="badge rounded-pill"
                    style={{ background: "#f57c00" }}
                  >
                    😨 Sợ hãi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorPage;
