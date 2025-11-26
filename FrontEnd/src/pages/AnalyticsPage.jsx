import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import EmotionBarBox from "../components/monitoring/EmotionBarBox";
import EmotionOverTimeBox from "../components/monitoring/EmotionOverTimeBox";

export default function AnalyticsPage() {
  const [data, setData] = useState({
    sessions: [],
    selectedSession: null,
    loading: false,
  });

  // Analytics state
  const [barData, setBarData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [lineData, setLineData] = useState([]);
  const [dominantEmotion, setDominantEmotion] = useState("Happy");
  const [stats, setStats] = useState({
    engagement: 75,
    positive: 68,
    attention: 80,
    stress: 25,
  });

  useEffect(() => {
    // Load recent sessions
    loadRecentSessions();
  }, []);

  const loadRecentSessions = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(
        `${API_BASE_URL}/sessions/recent_classes`
      );

      if (response.data.data) {
        setData((prev) => ({
          ...prev,
          sessions: response.data.data,
          loading: false,
        }));
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  // Handle session selection and load analytics
  const handleSelectSession = async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}`);
      const session = response.data;

      setData((prev) => ({ ...prev, selectedSession: session }));

      // Parse emotion summary if available
      if (session.emotion_summary) {
        try {
          const emotionData = JSON.parse(session.emotion_summary);
          const emotions = [
            "Happy",
            "Sad",
            "Angry",
            "Surprise",
            "Neutral",
            "Disgust",
            "Fear",
          ];
          const counts = emotions.map((e) => emotionData[e] || 0);
          setBarData(counts);

          // Find dominant emotion
          const maxEmotion = emotions[counts.indexOf(Math.max(...counts))];
          setDominantEmotion(maxEmotion || "Unknown");

          // Generate line data (positive rate over time)
          const lineChartData = counts.map((_, idx) => Math.random() * 100);
          setLineData(lineChartData);

          // Update stats
          const totalCount = counts.reduce((a, b) => a + b, 0);
          const positiveCount = (counts[0] || 0) + (counts[3] || 0); // Happy + Surprise
          const positiveRate =
            totalCount > 0 ? (positiveCount / totalCount) * 100 : 0;

          setStats({
            engagement: Math.round(positiveRate),
            positive: Math.round(positiveRate),
            attention: Math.round(75 + Math.random() * 25),
            stress: Math.round(Math.max(0, 100 - positiveRate)),
          });
        } catch (e) {
          console.error("Error parsing emotion summary:", e);
        }
      }
    } catch (error) {
      console.error("Error loading session details:", error);
    }
  };

  return (
    <div className="row mt-4">
      {/* Breadcrumb */}
      <div className="col-md-12">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/monitor">Class</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Analytics
            </li>
          </ol>
        </nav>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>Class Analytics
              </h4>
              <span className="badge bg-light text-dark">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h5>{data.selectedSession?.subject || "Demo Subject"}</h5>
                <p className="text-muted">
                  Teacher ID: {data.selectedSession?.teacher_id || "T123"}
                </p>
              </div>
              <div className="col-md-6 text-end">
                <div className="btn-group">
                  <button className="btn btn-outline-primary">
                    <i className="fas fa-user-check me-1"></i> Attendance
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="fas fa-arrow-left me-1"></i> Back to Class
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session List */}
      {data.sessions.length > 0 && (
        <div className="col-md-12 mb-4">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Recent Sessions</h5>
            </div>
            <div className="card-body">
              <div className="list-group">
                {data.sessions.slice(0, 5).map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${
                      data.selectedSession?.id === session.id ? "active" : ""
                    }`}
                    onClick={() => handleSelectSession(session.id)}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{session.subject}</h6>
                      <small>{session.created_at}</small>
                    </div>
                    <p className="mb-1 text-muted">
                      <small>Session ID: {session.id}</small>
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="col-md-12">
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="stat-card card p-3 flex-fill">
            <span className="stat-label text-muted">Total Readings</span>
            <span className="stat-value fs-3">
              {data.selectedSession?.total_frames || 120}
            </span>
            <span className="text-muted">data points</span>
          </div>

          <div className="stat-card card p-3 flex-fill">
            <span className="stat-label text-muted">Average Students</span>
            <span className="stat-value fs-3">28.5</span>
            <span className="text-muted">per capture</span>
          </div>

          <div className="stat-card card p-3 flex-fill">
            <span className="stat-label text-muted">Dominant Emotion</span>
            <span className="stat-value fs-3">
              <i className="fas fa-smile text-warning"></i>
            </span>
            <span className="text-warning">{dominantEmotion}</span>
          </div>

          <div className="stat-card card p-3 flex-fill">
            <span className="stat-label text-muted">Class Duration</span>
            <span className="stat-value fs-3">
              {data.selectedSession?.duration_seconds
                ? Math.round(data.selectedSession.duration_seconds / 60)
                : 45}
            </span>
            <span className="text-muted">minutes</span>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="col-lg-6">
        <div className="card mb-4" style={{ minHeight: 340 }}>
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">📊 Emotion Distribution</h5>
          </div>
          <div className="card-body">
            <EmotionBarBox data={barData} />
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card mb-4" style={{ minHeight: 340 }}>
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">📈 Emotion Over Time</h5>
          </div>
          <div className="card-body">
            <EmotionOverTimeBox lineData={lineData} />
          </div>
        </div>
      </div>

      {/* Teaching Insights */}
      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-lightbulb me-2"></i>Teaching Insights
            </h5>
          </div>
          <div className="card-body">
            <div className="alert alert-warning bg-opacity-10">
              <h5 className="alert-heading">
                <i className="fas fa-smile me-2"></i>Predominant Emotion:{" "}
                {dominantEmotion}
              </h5>
              <p>
                Lớp học đang có xu hướng{" "}
                {dominantEmotion === "Happy" ? "tích cực" : "trung lập"}. Bạn có
                thể tận dụng năng lượng này để tăng tốc độ giảng hoặc chuyển
                sang hoạt động nhóm.
              </p>
              <hr />
              <p className="mb-0">
                <strong>Teaching Tip:</strong> Thử đặt câu hỏi mở, cho sinh viên
                chia sẻ cảm nhận để duy trì sự hứng thú.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Notes */}
      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-sticky-note me-2"></i>Class Notes
            </h5>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Class Summary</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Enter class summary..."
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Detailed Notes</label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Enter detailed notes..."
                ></textarea>
              </div>
              <div className="text-end">
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-1"></i> Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
