import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";
import "../../styles/AnalyticsDashboard.css";

const EMOTION_COLORS = {
  Happy: "#28a745",
  Surprise: "#ffc107",
  Neutral: "#6c757d",
  Sad: "#007bff",
  Angry: "#dc3545",
  Disgust: "#e83e8c",
  Fear: "#fd7e14",
  Anger: "#dc3545",
};

const AnalyticsDashboard = ({ analysisData }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (analysisData && analysisData.timeline) {
      fetchAnalytics(analysisData);
    }
  }, [analysisData]);

  const fetchAnalytics = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/monitoring/analytics`,
        { timeline: data.timeline }
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error("Analytics error:", error);
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!analytics) {
    return (
      <div className="alert alert-info">Upload a video to see analytics</div>
    );
  }

  // Prepare data for charts
  const emotionDistData = Object.entries(analytics.emotion_distribution).map(
    ([emotion, count]) => ({
      name: emotion,
      value: count,
      fill: EMOTION_COLORS[emotion] || "#6c757d",
    })
  );

  const emotionTimeData = (analytics.emotion_over_time || []).map(
    (entry, idx) => ({
      frame: Math.round(entry.frame / 10),
      emotion: entry.emotion,
      positive_rate: entry.positive_rate,
    })
  );

  // Summary stats
  const stats = [
    {
      label: "Total Samples",
      value: analytics.total_samples,
      icon: "📊",
    },
    {
      label: "Dominant Emotion",
      value: analytics.dominant_emotion,
      icon: "😊",
      color: EMOTION_COLORS[analytics.dominant_emotion],
    },
    {
      label: "Positive Rate",
      value: `${analytics.positive_rate}%`,
      icon: "👍",
    },
  ];

  return (
    <div className="analytics-dashboard">
      {/* Summary Stats */}
      <div className="row mb-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-md-4 mb-3">
            <div className="card stat-card h-100">
              <div className="card-body text-center">
                <div className="stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <h6 className="text-muted mb-2">{stat.label}</h6>
                <h3 className="mb-0" style={{ color: stat.color }}>
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Teaching Insights */}
      {analytics.teaching_insights &&
        analytics.teaching_insights.length > 0 && (
          <div className="card mb-4 alert-info">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">💡 Teaching Insights</h5>
            </div>
            <div className="card-body">
              {analytics.teaching_insights.map((insight, idx) => (
                <p key={idx} className="mb-2">
                  {insight}
                </p>
              ))}
            </div>
          </div>
        )}

      {/* Charts Row */}
      <div className="row">
        {/* Emotion Distribution - Bar Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">📊 Emotion Distribution</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={emotionDistData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                    {emotionDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Emotion Distribution - Pie Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">🥧 Emotion Breakdown</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={emotionDistData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {emotionDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Emotion Over Time */}
      <div className="card">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">📈 Emotion Over Time</h5>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={emotionTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="frame"
                label={{
                  value: "Frame",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Positive Rate (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value) => `${value}%`}
                labelFormatter={(label) => `Frame: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="positive_rate"
                stroke="#28a745"
                dot={false}
                strokeWidth={2}
                name="Positive Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-4">
        <button className="btn btn-primary">
          <i className="fas fa-download me-2"></i>Export Report
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
