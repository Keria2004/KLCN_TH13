import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import EmotionBarBox from "../components/monitoring/EmotionBarBox";
import EmotionOverTimeBox from "../components/monitoring/EmotionOverTimeBox";
import jsPDF from "jspdf";

// 🔇 Ẩn axios error notifications
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ log error, không hiển thị alert
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

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

    // 🔄 Kiểm tra sessionsList từ localStorage (cập nhật từ Monitor)
    const sessionsListStr = localStorage.getItem("sessionsList");
    if (sessionsListStr) {
      try {
        const sessionsList = JSON.parse(sessionsListStr);
        console.log(
          "📚 Using updated sessions list from localStorage:",
          sessionsList
        );
        setData((prev) => ({
          ...prev,
          sessions: sessionsList,
        }));
        localStorage.removeItem("sessionsList");
        return; // Dừng tại đây, không cần fetch từ API
      } catch (e) {
        console.warn("Error parsing sessionsList:", e);
      }
    }

    // Nếu không có sessionsList, fetch từ API
    loadRecentSessions();
  }, []);

  // Process session emotion data
  const processSessionData = (sessionData) => {
    if (sessionData.emotion_counts) {
      const emotions = [
        "Vui vẻ",
        "Buồn",
        "Giận dữ",
        "Ngạc nhiên",
        "Bình thường",
        "Ghê tởm",
        "Sợ hãi",
      ];
      const counts = emotions.map((e) => sessionData.emotion_counts[e] || 0);
      setBarData(counts);

      // 🎭 Tính cảm xúc chủ đạo: lấy cảm xúc có count cao nhất, loại bỏ 'Bình thường'
      let maxIdx = 0;
      let maxCount = -1;
      counts.forEach((count, idx) => {
        if (emotions[idx] !== "Bình thường" && count > maxCount) {
          maxCount = count;
          maxIdx = idx;
        }
      });
      const maxEmotion = maxCount > 0 ? emotions[maxIdx] : "Bình thường";
      setDominantEmotion(maxEmotion);

      const lineChartData = counts.map((_, idx) => Math.random() * 100);
      setLineData(lineChartData);

      const totalCount = counts.reduce((a, b) => a + b, 0);
      const positiveCount = (counts[0] || 0) + (counts[3] || 0);
      const positiveRate =
        totalCount > 0 ? (positiveCount / totalCount) * 100 : 0;

      setStats({
        engagement: Math.round(positiveRate),
        positive: Math.round(positiveRate),
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
      // Ẩn alert lỗi - chỉ log ra console
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
          let emotionData = session.emotion_summary;
          // If it's a string, parse it; if it's already an object, use it directly
          if (typeof emotionData === "string") {
            emotionData = JSON.parse(emotionData);
          }

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
      doc.text("📊 BÁO CÁO PHÂN TÍCH LỚP HỌC", pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 12;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Được tạo: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        yPos,
        { align: "center" }
      );
      yPos += 15;

      // Session Info
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("THÔNG TIN BUỔI HỌC", 15, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.text(`Môn Học: ${data.selectedSession?.subject || "N/A"}`, 20, yPos);
      yPos += 6;
      doc.text(
        `Ngày: ${new Date(data.selectedSession?.created_at).toLocaleDateString(
          "vi-VN"
        )}`,
        20,
        yPos
      );
      yPos += 15;

      // Emotion Statistics
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("THỐNG KÊ CẢM XÚC", 15, yPos);
      yPos += 8;
      doc.setFontSize(10);

      const emotions = [
        "Vui vẻ",
        "Buồn",
        "Giận dữ",
        "Ngạc nhiên",
        "Bình thường",
        "Ghê tởm",
        "Sợ hãi",
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
      doc.text("CHỈ SỐ HIỆU SUẤT", 15, yPos);
      yPos += 8;
      doc.setFontSize(10);

      doc.text(`Mức độ hứng thú: ${stats.engagement}%`, 20, yPos);
      yPos += 6;
      doc.text(`Tỷ lệ tích cực: ${stats.positive}%`, 20, yPos);
      yPos += 6;
      doc.text(`Cảm xúc chủ đạo: ${dominantEmotion}`, 20, yPos);
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

      let csv = "Báo Cáo Phân Tích Lớp Học\n";
      csv += `Tạo: ${new Date().toLocaleString()}\n\n`;

      csv += "THÔNG TIN BUỔI HỌC\n";
      csv += `Môn Học,${data.selectedSession?.subject || "N/A"}\n`;
      csv += `ID Giáo Viên,${data.selectedSession?.teacher_id || "N/A"}\n`;
      csv += `Date,${new Date(
        data.selectedSession?.created_at
      ).toLocaleDateString("vi-VN")}\n\n`;

      csv += "THỐNG KÊ CẢM XÚC\n";
      csv += "Cảm Xúc,Số Lượng,Tỷ Lệ\n";
      const totalFrames = barData.reduce((a, b) => a + b, 0) || 1;
      emotions.forEach((emotion, idx) => {
        const percentage = ((barData[idx] / totalFrames) * 100).toFixed(1);
        csv += `${emotion},${barData[idx] || 0},${percentage}%\n`;
      });

      csv += "\nCHỈ SỐ HIỆU SUẤT\n";
      csv += "Chỉ Số,Giá Trị\n";
      csv += `Mức độ hứng thú,${stats.engagement}%\n`;
      csv += `Tỷ lệ tích cực,${stats.positive}%\n`;
      csv += `Cảm xúc chủ đạo,${dominantEmotion}\n`;

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
        "Vui vẻ",
        "Buồn",
        "Giận dữ",
        "Ngạc nhiên",
        "Bình thường",
        "Ghê tởm",
        "Sợ hãi",
      ];

      const reportData = {
        loai_bao_cao: "Báo Cáo Phân Tích Lớp Học",
        tao_luc: new Date().toISOString(),
        buoi_hoc: {
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
          muc_do_hung_thu: stats.engagement,
          ty_le_tich_cuc: stats.positive,
          cam_xuc_chu_dao: dominantEmotion,
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

      alert("✅ Đã xuất JSON thành công!");
    } catch (error) {
      console.error("Error exporting JSON:", error);
      alert("❌ Lỗi khi xuất JSON");
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
      let emotionSummary = {};

      // Handle emotion_summary - could be string, object, or null
      if (session.emotion_summary) {
        if (typeof session.emotion_summary === "string") {
          try {
            emotionSummary = JSON.parse(session.emotion_summary);
          } catch (e) {
            console.warn("Failed to parse emotion_summary string:", e);
            emotionSummary = {};
          }
        } else if (typeof session.emotion_summary === "object") {
          emotionSummary = session.emotion_summary;
        }
      }

      const emotions = [
        "Vui vẻ",
        "Buồn",
        "Giận dữ",
        "Ngạc nhiên",
        "Bình thường",
        "Ghê tởm",
        "Sợ hãi",
      ];
      const counts = emotions.map((e) => emotionSummary[e] || 0);
      // 🎭 Tính cảm xúc chủ đạo: lấy cảm xúc có count cao nhất, loại bỏ 'Bình thường'
      let maxIdx = 0;
      let maxCount = -1;
      counts.forEach((count, idx) => {
        if (emotions[idx] !== "Bình thường" && count > maxCount) {
          maxCount = count;
          maxIdx = idx;
        }
      });
      const dominantEmotion = maxCount > 0 ? emotions[maxIdx] : "Bình thường";

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
      "Vui vẻ": "bg-success",
      Buồn: "bg-primary",
      "Giận dữ": "bg-danger",
      "Ngạc nhiên": "bg-warning",
      "Bình thường": "bg-secondary",
      "Ghê tởm": "bg-info",
      "Sợ hãi": "bg-orange",
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
    <div className="min-vh-100" style={{ background: "#f8f9fa" }}>
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
            <i className="fas fa-chart-line me-2"></i>Phân Tích & Báo Cáo Cảm
            Xúc
          </h1>
          <p className="lead mb-0" style={{ opacity: 0.9 }}>
            Thống kê chi tiết và báo cáo về cảm xúc lớp học
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-4">
        {/* Breadcrumb */}
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

        {/* Main Card with Tabs */}
        <div
          className="card shadow-sm border-0"
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "20px",
            }}
          >
            <h4 className="mb-0">
              <i className="fas fa-chart-bar me-2"></i>Phân Tích & Báo Cáo
            </h4>
          </div>

          {/* Tabs */}
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

          <div className="card-body p-4">
            {/* Charts Tab */}
            {activeTab === "charts" && (
              <div>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5 style={{ color: "#667eea" }} className="fw-bold">
                      {data.selectedSession?.subject || "Môn Học Demo"}
                    </h5>
                    <p className="text-muted small">
                      <i className="fas fa-user me-1"></i>ID Giáo Viên:{" "}
                      {data.selectedSession?.teacher_id || "T123"}
                    </p>
                  </div>
                  <div className="col-md-6 text-end">
                    <div className="btn-group gap-2">
                      <button
                        className="btn btn-sm"
                        onClick={exportPDF}
                        disabled={exporting}
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                        }}
                      >
                        <i className="fas fa-file-pdf me-1"></i>PDF
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={exportCSV}
                        disabled={exporting}
                        style={{
                          background:
                            "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                        }}
                      >
                        <i className="fas fa-file-csv me-1"></i>CSV
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={exportJSON}
                        disabled={exporting}
                        style={{
                          background:
                            "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
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

                {/* Stat cards */}
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
                          {stats.engagement}%
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
                          {stats.positive}%
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
                        <h3
                          style={{ color: "#764ba2" }}
                          className="fw-bold text-truncate"
                        >
                          {dominantEmotion}
                        </h3>
                      </div>
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
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                          background:
                            "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
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
                {data.sessions.length > 0 && (
                  <div className="mt-4">
                    <div
                      className="card shadow-sm border-0"
                      style={{ borderRadius: "12px" }}
                    >
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #0dcaf0 0%, #00d4ff 100%)",
                          color: "white",
                          padding: "15px",
                        }}
                      >
                        <h6 className="mb-0">📚 Buổi Học Gần Đây</h6>
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
                              style={{
                                borderLeft:
                                  data.selectedSession?.id === session.id
                                    ? "4px solid #667eea"
                                    : "none",
                              }}
                            >
                              <div className="d-flex w-100 justify-content-between align-items-center">
                                <h6 className="mb-1 fw-bold">
                                  {session.subject}
                                </h6>
                                <small className="text-muted">
                                  {new Date(
                                    session.created_at
                                  ).toLocaleDateString("vi-VN")}
                                </small>
                              </div>
                              <p className="mb-0 text-muted small">
                                <i className="fas fa-id-card me-1"></i>ID:{" "}
                                {session.id}
                              </p>
                            </button>
                          ))}
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
                    <label className="form-label fw-semibold">Môn Học</label>
                    <select
                      className="form-select"
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                      style={{ borderRadius: "8px" }}
                    >
                      <option value="all">Tất Cả Môn Học</option>
                      {allSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Trạng Thái</label>
                    <select
                      className="form-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={{ borderRadius: "8px" }}
                    >
                      <option value="all">Tất Cả Trạng Thái</option>
                      <option value="active">Đang Hoạt Động</option>
                      <option value="closed">Đã Đóng</option>
                    </select>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <div className="gap-2 w-100 d-flex">
                      <button
                        className="btn w-100 fw-bold"
                        onClick={exportAllPDF}
                        disabled={exporting || filteredSessions.length === 0}
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                        }}
                      >
                        <i className="fas fa-file-pdf me-1"></i>PDF
                      </button>
                      <button
                        className="btn w-100 fw-bold"
                        onClick={exportAllCSV}
                        disabled={exporting || filteredSessions.length === 0}
                        style={{
                          background:
                            "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                        }}
                      >
                        <i className="fas fa-file-csv me-1"></i>CSV
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className="alert alert-info mb-3"
                  style={{ borderRadius: "8px" }}
                >
                  <small>
                    <i className="fas fa-info-circle me-2"></i>Showing{" "}
                    {filteredSessions.length} of {data.sessions.length} sessions
                  </small>
                </div>

                {/* Table */}
                {filteredSessions.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <i
                      className="fas fa-inbox fa-3x mb-3"
                      style={{ color: "#ccc" }}
                    ></i>
                    <p className="fw-bold">Không Tìm Thấy Buổi Học</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead style={{ background: "#f8f9fa" }}>
                        <tr>
                          <th style={{ color: "#667eea", fontWeight: "bold" }}>
                            Ngày
                          </th>
                          <th style={{ color: "#667eea", fontWeight: "bold" }}>
                            Môn Học
                          </th>
                          <th style={{ color: "#667eea", fontWeight: "bold" }}>
                            Giáo Viên
                          </th>
                          <th style={{ color: "#667eea", fontWeight: "bold" }}>
                            Cảm Xúc Chủ Đạo
                          </th>
                          <th style={{ color: "#667eea", fontWeight: "bold" }}>
                            Tỷ Lệ Tích Cực
                          </th>
                          <th style={{ color: "#667eea", fontWeight: "bold" }}>
                            Trạng Thái
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSessions.map((session) => (
                          <tr
                            key={session.id}
                            style={{ borderBottom: "1px solid #e0e0e0" }}
                          >
                            <td>
                              <small className="text-muted">
                                {new Date(
                                  session.created_at
                                ).toLocaleDateString("vi-VN")}
                              </small>
                            </td>
                            <td>
                              <strong>{session.subject || "N/A"}</strong>
                            </td>
                            <td>
                              <code style={{ color: "#667eea" }}>
                                T{session.teacher_id}
                              </code>
                            </td>
                            <td>
                              <span
                                className={`badge rounded-pill ${getEmotionBadgeColor(
                                  session.dominantEmotion
                                )}`}
                                style={{ color: "white" }}
                              >
                                {session.dominantEmotion}
                              </span>
                            </td>
                            <td>
                              <span
                                className="fw-bold"
                                style={{ color: "#28a745" }}
                              >
                                {session.positiveRate}%
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge rounded-pill ${
                                  session.status === "closed"
                                    ? "bg-success"
                                    : "bg-warning"
                                }`}
                                style={{ color: "white" }}
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
                  <div className="row g-3 mt-4">
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
                            Tổng Số Buổi Học
                          </h6>
                          <h3 style={{ color: "#667eea" }} className="fw-bold">
                            {filteredSessions.length}
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
                            Trung Bình Tích Cực
                          </h6>
                          <h3 style={{ color: "#28a745" }} className="fw-bold">
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
                          <h3 style={{ color: "#764ba2" }} className="fw-bold">
                            {Object.entries(
                              filteredSessions.reduce((acc, s) => {
                                acc[s.dominantEmotion] =
                                  (acc[s.dominantEmotion] || 0) + 1;
                                return acc;
                              }, {})
                            ).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
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
