import React, { useState } from "react";
import LiveMonitoring from "../components/monitoring/LiveMonitoring";
import VideoUpload from "../components/monitoring/VideoUpload";
import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";

const MonitorPage = () => {
  const [activeTab, setActiveTab] = useState("live");
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setActiveTab("analytics");
  };

  // For Live Monitoring to send analysis data to Analytics
  const handleLiveAnalysisSubmit = (sessionData) => {
    // Handle both old timeline format and new sessionData format
    const analysisPayload = sessionData.timeline
      ? {
          session_id: sessionData.session_id,
          start_time: sessionData.start_time,
          end_time: sessionData.end_time,
          duration: sessionData.duration,
          frames_total: sessionData.total_frames,
          frames_analyzed: sessionData.total_frames,
          emotion_counts: sessionData.emotion_counts,
          timeline: sessionData.timeline,
        }
      : {
          frames_total: sessionData.length,
          frames_analyzed: sessionData.length,
          timeline: sessionData,
        };

    setAnalysisData(analysisPayload);
    setActiveTab("analytics");
  };

  return (
    <div className="monitor-page">
      <div className="page-header mb-4">
        <h1 className="h2">
          <i className="fas fa-video me-2"></i>
          Emotion Monitoring System
        </h1>
        <p className="text-muted">
          Giám sát và phân tích cảm xúc lớp học theo thời gian thực
        </p>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "live" ? "active" : ""}`}
            onClick={() => setActiveTab("live")}
            type="button"
            role="tab"
          >
            <i className="fas fa-video me-2"></i>
            Live Monitoring
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
            type="button"
            role="tab"
          >
            <i className="fas fa-upload me-2"></i>
            Upload Video
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
            type="button"
            role="tab"
            disabled={!analysisData}
          >
            <i className="fas fa-chart-bar me-2"></i>
            Analytics
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Live Monitoring Tab */}
        <div
          className={`tab-pane fade ${
            activeTab === "live" ? "show active" : ""
          }`}
          role="tabpanel"
        >
          <LiveMonitoring onAnalysisExport={handleLiveAnalysisSubmit} />
        </div>

        {/* Video Upload Tab */}
        <div
          className={`tab-pane fade ${
            activeTab === "upload" ? "show active" : ""
          }`}
          role="tabpanel"
        >
          <VideoUpload onAnalysisComplete={handleAnalysisComplete} />
        </div>

        {/* Analytics Tab */}
        <div
          className={`tab-pane fade ${
            activeTab === "analytics" ? "show active" : ""
          }`}
          role="tabpanel"
        >
          <AnalyticsDashboard analysisData={analysisData} />
        </div>
      </div>

      {/* Info Cards */}
      <div className="row mt-5">
        <div className="col-md-6 mb-3">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-lightbulb text-warning me-2"></i>
                Tips
              </h5>
              <ul className="small mb-0">
                <li>Use live monitoring to watch real-time emotion changes</li>
                <li>Upload pre-recorded videos for detailed analysis</li>
                <li>Check analytics to understand overall class sentiment</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-info-circle text-info me-2"></i>
                Emotions Detected
              </h5>
              <div className="small">
                😄 Happy | 😲 Surprise | 😐 Neutral | 😢 Sad | 😡 Angry | 😖
                Disgust | 😨 Fear
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorPage;
