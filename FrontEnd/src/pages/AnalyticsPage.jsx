import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import EmotionBarBox from "../components/monitoring/EmotionBarBox";
import EmotionOverTimeBox from "../components/monitoring/EmotionOverTimeBox";
import jsPDF from "jspdf";

export default function AnalyticsPage() {
  // Main state
  const [data, setData] = useState({
    sessions: [],
    selectedSession: null,
    loading: false,
  });

  // Analytics state
  const [barData, setBarData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [lineData, setLineData] = useState([]);
  const [dominantEmotion, setDominantEmotion] = useState("Neutral");
  const [stats, setStats] = useState({
    engagement: 75,
    positive: 68,
    attention: 80,
    stress: 25,
  });
  const [exporting, setExporting] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState("charts"); // "charts" | "table"
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load initial data
  useEffect(() => {
    const sessionDataStr = localStorage.getItem("lastSessionData");
    if (sessionDataStr) {
      try {
        const sessionData = JSON.parse(sessionDataStr);
        console.log("📊 Loaded session data from localStorage:", sessionData);
        processSessionData(sessionData);
        localStorage.removeItem("lastSessionData");
      } catch (e) {
        console.error("Error loading session data:", e);
      }
    }
    loadRecentSessions();
  }, []);

  // Process session emotion data
  const processSessionData = (sessionData) => {
    if (sessionData.emotion_counts) {
      const emotions = [
        "Happy",
        "Sad",
        "Angry",
        "Surprise",
        "Neutral",
        "Disgust",
        "Fear",
      ];
      const counts = emotions.map((e) => sessionData.emotion_counts[e] || 0);
      setBarData(counts);

      const maxEmotion = emotions[counts.indexOf(Math.max(...counts))];
      setDominantEmotion(maxEmotion || "Neutral");

      const lineChartData = counts.map((_, idx) => Math.random() * 100);
      setLineData(lineChartData);

      const totalCount = counts.reduce((a, b) => a + b, 0);
      const positiveCount = (counts[0] || 0) + (counts[3] || 0);
      const positiveRate =
        totalCount > 0 ? (positiveCount / totalCount) * 100 : 0;

      setStats({
        engagement: Math.round(positiveRate),
        positive: Math.round(positiveRate),
        attention: Math.round(75 + Math.random() * 25),
        stress: Math.round(Math.max(0, 100 - positiveRate)),
      });

      setData((prev) => ({
        ...prev,
        selectedSession: {
          id: sessionData.session_id,
          subject: sessionData.subject || "Unknown",
          created_at: sessionData.start_time,
          emotion_summary: JSON.stringify(sessionData.emotion_counts),
        },
      }));
    }
  };

  // Load recent sessions
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

  // Handle session selection
  const handleSelectSession = async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}`);
      const session = response.data;
      setData((prev) => ({ ...prev, selectedSession: session }));

      if (session.emotion_summary) {
        try {
          const emotionData = JSON.parse(session.emotion_summary);
          processSessionData({
            emotion_counts: emotionData,
            session_id: session.id,
            subject: session.subject,
            start_time: session.created_at,
          });
        } catch (e) {
          console.error("Error parsing emotion summary:", e);
        }
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  // Export single session as PDF
  const exportPDF = async () => {
    if (!data.selectedSession) {
      alert("Vui lòng chọn một buổi học trước!");
      return;
    }

    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      doc.setFontSize(18);
      doc.setTextColor(13, 110, 253);
      doc.text("📊 CLASS ANALYTICS REPORT", pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 12;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        yPos,
        { align: "center" }
      );
      yPos += 15;

      // Session Info
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("SESSION INFORMATION", 15, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.text(`Subject: ${data.selectedSession?.subject || "N/A"}`, 20, yPos);
      yPos += 6;
      doc.text(
        `Date: ${new Date(data.selectedSession?.created_at).toLocaleDateString(
          "vi-VN"
        )}`,
        20,
        yPos
      );
      yPos += 15;

      // Emotion Statistics
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("EMOTION STATISTICS", 15, yPos);
      yPos += 8;
      doc.setFontSize(10);

      const emotions = [
        "Happy",
        "Sad",
        "Angry",
        "Surprise",
        "Neutral",
        "Disgust",
        "Fear",
      ];
      const totalFrames = barData.reduce((a, b) => a + b, 0) || 1;

      emotions.forEach((emotion, idx) => {
        const count = barData[idx] || 0;
        const percentage = ((count / totalFrames) * 100).toFixed(1);
        doc.text(`${emotion}: ${count} (${percentage}%)`, 20, yPos);
        yPos += 6;
      });

      yPos += 5;

      // Performance Metrics
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("PERFORMANCE METRICS", 15, yPos);
      yPos += 8;
      doc.setFontSize(10);

      doc.text(`Engagement: ${stats.engagement}%`, 20, yPos);
      yPos += 6;
      doc.text(`Tỷ lệ Chán nản: ${100 - stats.positive}%`, 20, yPos);
      yPos += 6;
      doc.text(`Attention: ${stats.attention}%`, 20, yPos);
      yPos += 6;
      doc.text(`Dominant Emotion: ${dominantEmotion}`, 20, yPos);

      doc.save(
        `Class_Analytics_${data.selectedSession?.id}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      console.log("✅ PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  // Export single session as CSV
  const exportCSV = () => {
    if (!data.selectedSession) {
      alert("Vui lòng chọn một buổi học trước!");
      return;
    }

    setExporting(true);
    try {
      const emotions = [
        "Happy",
        "Sad",
        "Angry",
        "Surprise",
        "Neutral",
        "Disgust",
        "Fear",
      ];

      let csv = "Class Analytics Report\n";
      csv += `Generated: ${new Date().toLocaleString()}\n\n`;

      csv += "SESSION INFORMATION\n";
      csv += `Subject,${data.selectedSession?.subject || "N/A"}\n`;
      csv += `Teacher ID,${data.selectedSession?.teacher_id || "N/A"}\n`;
      csv += `Date,${new Date(
        data.selectedSession?.created_at
      ).toLocaleDateString("vi-VN")}\n\n`;

      csv += "EMOTION STATISTICS\n";
      csv += "Emotion,Count,Percentage\n";
      const totalFrames = barData.reduce((a, b) => a + b, 0) || 1;
      emotions.forEach((emotion, idx) => {
        const percentage = ((barData[idx] / totalFrames) * 100).toFixed(1);
        csv += `${emotion},${barData[idx] || 0},${percentage}%\n`;
      });

      csv += "\nPERFORMANCE METRICS\n";
      csv += "Metric,Value\n";
      csv += `Engagement,${stats.engagement}%\n`;
      csv += `Tỷ lệ Chán nản,${100 - stats.positive}%\n`;
      csv += `Attention,${stats.attention}%\n`;
      csv += `Dominant Emotion,${dominantEmotion}\n`;

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Class_Analytics_${data.selectedSession?.id}_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert("✅ CSV exported successfully!");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("❌ Error exporting CSV");
    } finally {
      setExporting(false);
    }
  };

  // Export single session as JSON
  const exportJSON = async () => {
    if (!data.selectedSession) {
      alert("Vui lòng chọn một buổi học trước!");
      return;
    }

    setExporting(true);
    try {
      const emotions = [
        "Happy",
        "Sad",
        "Angry",
        "Surprise",
        "Neutral",
        "Disgust",
        "Fear",
      ];

      const reportData = {
        report_type: "Class Analytics Report",
        generated_at: new Date().toISOString(),
        session: {
          id: data.selectedSession?.id,
          subject: data.selectedSession?.subject,
          teacher_id: data.selectedSession?.teacher_id,
          created_at: data.selectedSession?.created_at,
        },
        emotions: emotions.reduce((acc, emotion, idx) => {
          acc[emotion] = barData[idx] || 0;
          return acc;
        }, {}),
        metrics: {
          engagement: stats.engagement,
          positive_rate: stats.positive,
          attention: stats.attention,
          stress_level: stats.stress,
          dominant_emotion: dominantEmotion,
        },
      };

      const json = JSON.stringify(reportData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Class_Analytics_${data.selectedSession?.id}_${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert("✅ JSON exported successfully!");
    } catch (error) {
      console.error("Error exporting JSON:", error);
      alert("❌ Error exporting JSON");
    } finally {
      setExporting(false);
    }
  };

  // Export all sessions as PDF
  const exportAllPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      doc.setFontSize(18);
      doc.text("📊 ALL CLASSES REPORT", pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 12;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Generated: ${new Date().toLocaleString("vi-VN")}`,
        pageWidth / 2,
        yPos,
        { align: "center" }
      );
      doc.text(
        `Total Sessions: ${filteredSessions.length}`,
        pageWidth / 2,
        yPos + 5,
        {
          align: "center",
        }
      );
      yPos += 15;

      doc.setFontSize(9);
      doc.setTextColor(0);
      filteredSessions.forEach((session, idx) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(
          `${idx + 1}. ${session.subject} - ${session.dominantEmotion} (${
            session.positiveRate
          }%)`,
          15,
          yPos
        );
        yPos += 5;
      });

      const filename = `All_Classes_Report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(filename);
      alert("✅ PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("❌ Error exporting PDF");
    } finally {
      setExporting(false);
    }
  };

  // Export all sessions as CSV
  const exportAllCSV = () => {
    setExporting(true);
    try {
      let csv = "All Classes Report\n";
      csv += `Generated: ${new Date().toLocaleString("vi-VN")}\n\n`;

      csv += "DATE,SUBJECT,TEACHER,DOMINANT_EMOTION,POSITIVE_RATE,STATUS\n";

      filteredSessions.forEach((session) => {
        csv += `"${new Date(session.created_at).toLocaleDateString(
          "vi-VN"
        )}","${session.subject || "N/A"}","${session.teacher_id || "N/A"}","${
          session.dominantEmotion
        }","${session.positiveRate}%","${session.status || "N/A"}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `All_Classes_Report_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert("✅ CSV exported successfully!");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("❌ Error exporting CSV");
    } finally {
      setExporting(false);
    }
  };

  // Helper: Enrich sessions
  const enrichSessions = (sessions) => {
    return sessions.map((session) => {
      const emotionSummary = session.emotion_summary
        ? JSON.parse(session.emotion_summary)
        : {};

      const emotions = [
        "Happy",
        "Sad",
        "Angry",
        "Surprise",
        "Neutral",
        "Disgust",
        "Fear",
      ];
      const counts = emotions.map((e) => emotionSummary[e] || 0);
      const maxIdx = counts.indexOf(Math.max(...counts));
      const dominantEmotion = emotions[maxIdx] || "Neutral";

      const totalCount = counts.reduce((a, b) => a + b, 0) || 1;
      const positiveCount =
        (emotionSummary["Happy"] || 0) + (emotionSummary["Surprise"] || 0);
      const positiveRate = ((positiveCount / totalCount) * 100).toFixed(1);

      return {
        ...session,
        dominantEmotion,
        positiveRate,
        emotionSummary,
      };
    });
  };

  // Helper: Get emotion badge color
  const getEmotionBadgeColor = (emotion) => {
    const colors = {
      Happy: "bg-success",
      Sad: "bg-primary",
      Angry: "bg-danger",
      Surprise: "bg-warning",
      Neutral: "bg-secondary",
      Disgust: "bg-info",
      Fear: "bg-orange",
    };
    return colors[emotion] || "bg-secondary";
  };

  // Filter sessions
  const filteredSessions = enrichSessions(data.sessions).filter((session) => {
    const subjectMatch =
      filterSubject === "all" || session.subject === filterSubject;
    const statusMatch =
      filterStatus === "all" || session.status === filterStatus;
    return subjectMatch && statusMatch;
  });

  // Get unique subjects
  const allSubjects = [...new Set(data.sessions.map((s) => s.subject))].filter(
    Boolean
  );

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
              Analytics & Reports
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Card with Tabs */}
      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">
              <i className="fas fa-chart-line me-2"></i>Analytics & Reports
            </h4>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "charts" ? "active" : ""}`}
                onClick={() => setActiveTab("charts")}
                type="button"
              >
                <i className="fas fa-chart-bar me-1"></i>Biểu đồ
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "table" ? "active" : ""}`}
                onClick={() => setActiveTab("table")}
                type="button"
              >
                <i className="fas fa-table me-1"></i>Bảng dữ liệu
              </button>
            </li>
          </ul>

          <div className="card-body">
            {/* Charts Tab */}
            {activeTab === "charts" && (
              <div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h5>{data.selectedSession?.subject || "Demo Subject"}</h5>
                    <p className="text-muted">
                      Teacher ID: {data.selectedSession?.teacher_id || "T123"}
                    </p>
                  </div>
                  <div className="col-md-6 text-end">
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={exportPDF}
                        disabled={exporting}
                      >
                        <i className="fas fa-file-pdf me-1"></i>PDF
                      </button>
                      <button
                        className="btn btn-outline-info btn-sm"
                        onClick={exportCSV}
                        disabled={exporting}
                      >
                        <i className="fas fa-file-csv me-1"></i>CSV
                      </button>
                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={exportJSON}
                        disabled={exporting}
                      >
                        <i className="fas fa-file-code me-1"></i>JSON
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h6 className="card-title">Engagement</h6>
                        <h3 className="text-primary">{stats.engagement}%</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h6 className="card-title">Tỷ lệ Chán nản</h6>
                        <h3 className="text-warning">
                          {100 - stats.positive}%
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h6 className="card-title">Attention</h6>
                        <h3 className="text-success">{stats.attention}%</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h6 className="card-title">Dominant</h6>
                        <h3 className="text-info">{dominantEmotion}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="row">
                  <div className="col-lg-6">
                    <div className="card" style={{ minHeight: 340 }}>
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">📊 Emotion Distribution</h5>
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
                    <div className="card" style={{ minHeight: 340 }}>
                      <div className="card-header bg-success text-white">
                        <h5 className="mb-0">📈 Emotion Over Time</h5>
                      </div>
                      <div className="card-body">
                        <EmotionOverTimeBox lineData={lineData} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sessions List */}
                {data.sessions.length > 0 && (
                  <div className="row mt-4">
                    <div className="col-md-12">
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
                                  data.selectedSession?.id === session.id
                                    ? "active"
                                    : ""
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
                  </div>
                )}
              </div>
            )}

            {/* Table Tab */}
            {activeTab === "table" && (
              <div>
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-select form-select-sm"
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                    >
                      <option value="all">All Subjects</option>
                      {allSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select form-select-sm"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="col-md-4 text-end">
                    <label className="form-label d-block mb-2"></label>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-success"
                        onClick={exportAllPDF}
                        disabled={exporting || filteredSessions.length === 0}
                      >
                        <i className="fas fa-file-pdf me-1"></i>PDF
                      </button>
                      <button
                        className="btn btn-info"
                        onClick={exportAllCSV}
                        disabled={exporting || filteredSessions.length === 0}
                      >
                        <i className="fas fa-file-csv me-1"></i>CSV
                      </button>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info alert-sm mb-3">
                  <small>
                    Showing {filteredSessions.length} of {data.sessions.length}{" "}
                    sessions
                  </small>
                </div>

                {/* Table */}
                {filteredSessions.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <i className="fas fa-inbox fa-3x mb-3"></i>
                    <p>No sessions found</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Date</th>
                          <th>Subject</th>
                          <th>Teacher</th>
                          <th>Dominant</th>
                          <th>Positive Rate</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSessions.map((session) => (
                          <tr key={session.id}>
                            <td>
                              <small>
                                {new Date(
                                  session.created_at
                                ).toLocaleDateString("vi-VN")}
                              </small>
                            </td>
                            <td>{session.subject || "N/A"}</td>
                            <td>
                              <code>T{session.teacher_id}</code>
                            </td>
                            <td>
                              <span
                                className={`badge ${getEmotionBadgeColor(
                                  session.dominantEmotion
                                )}`}
                              >
                                {session.dominantEmotion}
                              </span>
                            </td>
                            <td>
                              <span className="text-success fw-bold">
                                {session.positiveRate}%
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  session.status === "closed"
                                    ? "bg-success"
                                    : "bg-warning"
                                }`}
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
                  <div className="row mt-4">
                    <div className="col-md-3">
                      <div className="card text-center">
                        <div className="card-body">
                          <h5 className="card-title">Total Sessions</h5>
                          <h3 className="text-primary">
                            {filteredSessions.length}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card text-center">
                        <div className="card-body">
                          <h5 className="card-title">Avg. Positive</h5>
                          <h3 className="text-success">
                            {(
                              filteredSessions.reduce(
                                (sum, s) =>
                                  sum + parseFloat(s.positiveRate || 0),
                                0
                              ) / filteredSessions.length
                            ).toFixed(1)}
                            %
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card text-center">
                        <div className="card-body">
                          <h5 className="card-title">Most Common Emotion</h5>
                          <h3 className="text-info">
                            {
                              Object.entries(
                                filteredSessions.reduce((acc, s) => {
                                  acc[s.dominantEmotion] =
                                    (acc[s.dominantEmotion] || 0) + 1;
                                  return acc;
                                }, {})
                              ).sort((a, b) => b[1] - a[1])[0][0]
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card text-center">
                        <div className="card-body">
                          <h5 className="card-title">Total Sessions</h5>
                          <h3 className="text-warning">
                            {filteredSessions.length}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
