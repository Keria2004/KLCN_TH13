import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ReportPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/sessions/recent_classes?limit=100`
      );

      if (response.data.data) {
        const enrichedSessions = response.data.data.map((session) => {
          const emotionSummary = session.emotion_summary
            ? JSON.parse(session.emotion_summary)
            : {};

          // Calculate dominant emotion
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

          // Calculate positive rate
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

        setSessions(enrichedSessions);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      alert("❌ Lỗi tải sessions");
    } finally {
      setLoading(false);
    }
  };

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

  const getEmotionIcon = (emotion) => {
    const icons = {
      Happy: "😊",
      Sad: "😢",
      Angry: "😠",
      Surprise: "😮",
      Neutral: "😐",
      Disgust: "🤢",
      Fear: "😨",
    };
    return icons[emotion] || "😐";
  };

  // Export all sessions as PDF
  const exportAllPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Header
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
      doc.text(`Total Sessions: ${sessions.length}`, pageWidth / 2, yPos + 5, {
        align: "center",
      });
      yPos += 15;

      // Sessions table
      const tableData = sessions.map((session) => [
        new Date(session.created_at).toLocaleDateString("vi-VN"),
        session.subject || "N/A",
        session.teacher_id || "N/A",
        `${getEmotionIcon(session.dominantEmotion)} ${session.dominantEmotion}`,
        `${session.positiveRate}%`,
        session.total_frames || 0,
        `${Math.round(session.duration_seconds / 60 || 45)}m`,
        session.status || "N/A",
      ]);

      doc.autoTable({
        startY: yPos,
        head: [
          [
            "Date",
            "Subject",
            "Teacher",
            "Dominant",
            "Positive",
            "Frames",
            "Duration",
            "Status",
          ],
        ],
        body: tableData,
        margin: { left: 10, right: 10 },
        styles: {
          cellPadding: 2.5,
          fontSize: 9,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [13, 110, 253],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Summary Statistics
      doc.setFontSize(12);
      doc.text("SUMMARY STATISTICS", 15, yPos);
      yPos += 8;

      const allEmotions = [
        "Happy",
        "Sad",
        "Angry",
        "Surprise",
        "Neutral",
        "Disgust",
        "Fear",
      ];
      const totalEmotionCounts = allEmotions.reduce((acc, emotion) => {
        acc[emotion] = sessions.reduce(
          (sum, session) => sum + (session.emotionSummary[emotion] || 0),
          0
        );
        return acc;
      }, {});

      const totalFrames = sessions.reduce(
        (sum, s) => sum + (s.total_frames || 0),
        0
      );
      const totalDuration = sessions.reduce(
        (sum, s) => sum + (s.duration_seconds || 0),
        0
      );
      const avgPositiveRate = (
        sessions.reduce((sum, s) => sum + parseFloat(s.positiveRate || 0), 0) /
        sessions.length
      ).toFixed(1);

      const statsData = [
        ["Total Sessions", sessions.length],
        ["Total Frames Analyzed", totalFrames],
        ["Total Duration", `${Math.round(totalDuration / 60)} min`],
        ["Average Positive Rate", `${avgPositiveRate}%`],
        [
          "Most Common Emotion",
          Object.entries(totalEmotionCounts).sort((a, b) => b[1] - a[1])[0][0],
        ],
      ];

      doc.autoTable({
        startY: yPos,
        head: [["Metric", "Value"]],
        body: statsData,
        margin: { left: 15, right: 15 },
        styles: {
          cellPadding: 3,
          fontSize: 10,
        },
        headStyles: {
          fillColor: [40, 167, 69],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Emotion Distribution
      doc.setFontSize(12);
      doc.text("EMOTION DISTRIBUTION", 15, yPos);
      yPos += 8;

      const emotionStatsData = allEmotions.map((emotion) => [
        `${getEmotionIcon(emotion)} ${emotion}`,
        totalEmotionCounts[emotion],
        `${((totalEmotionCounts[emotion] / totalFrames) * 100).toFixed(1)}%`,
      ]);

      doc.autoTable({
        startY: yPos,
        head: [["Emotion", "Count", "Percentage"]],
        body: emotionStatsData,
        margin: { left: 15, right: 15 },
        styles: {
          cellPadding: 2.5,
          fontSize: 9,
        },
        headStyles: {
          fillColor: [255, 193, 7],
          textColor: 0,
          fontStyle: "bold",
        },
      });

      // Footer
      const pageCount = doc.internal.getPages().length;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

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

  // Export as CSV
  const exportAllCSV = () => {
    setExporting(true);
    try {
      let csv = "All Classes Report\n";
      csv += `Generated: ${new Date().toLocaleString("vi-VN")}\n\n`;

      csv +=
        "DATE,SUBJECT,TEACHER,DOMINANT_EMOTION,POSITIVE_RATE,TOTAL_FRAMES,DURATION_MIN,STATUS\n";

      sessions.forEach((session) => {
        csv += `"${new Date(session.created_at).toLocaleDateString(
          "vi-VN"
        )}","${session.subject || "N/A"}","${session.teacher_id || "N/A"}","${
          session.dominantEmotion
        }","${session.positiveRate}%","${
          session.total_frames || 0
        }","${Math.round(session.duration_seconds / 60 || 45)}","${
          session.status || "N/A"
        }"\n`;
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

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const subjectMatch =
      filterSubject === "all" || session.subject === filterSubject;
    const statusMatch =
      filterStatus === "all" || session.status === filterStatus;
    return subjectMatch && statusMatch;
  });

  const allSubjects = [...new Set(sessions.map((s) => s.subject))].filter(
    Boolean
  );

  return (
    <div className="row mt-4">
      <div className="col-md-12">
        <h3 className="mb-3">
          <i className="fas fa-file-alt me-2"></i>Class Reports
        </h3>
        <p className="text-muted">
          Tổng hợp các buổi học, thống kê cảm xúc & hiệu quả giảng dạy.
        </p>

        {/* Export buttons */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={exportAllPDF}
                disabled={exporting || sessions.length === 0}
              >
                <i className="fas fa-file-pdf me-1"></i>
                {exporting ? "Exporting..." : "Export PDF"}
              </button>
              <button
                className="btn btn-info btn-sm"
                onClick={exportAllCSV}
                disabled={exporting || sessions.length === 0}
              >
                <i className="fas fa-file-csv me-1"></i>
                {exporting ? "Exporting..." : "Export CSV"}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={loadSessions}
                disabled={loading}
              >
                <i className="fas fa-sync me-1"></i>
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
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
              <div className="col-md-4">
                <label className="form-label">Results</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={`${filteredSessions.length} / ${sessions.length} sessions`}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sessions table */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>
              <i className="fas fa-list me-2"></i>Report List
            </span>
            <span className="badge bg-primary">{filteredSessions.length}</span>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center text-muted py-5">
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Loading sessions...
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="fas fa-inbox fa-3x mb-3 text-muted"></i>
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
                      <th>Dominant Emotion</th>
                      <th>Positive Rate</th>
                      <th>Frames</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((session) => (
                      <tr key={session.id}>
                        <td>
                          <small>
                            {new Date(session.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
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
                            {getEmotionIcon(session.dominantEmotion)}{" "}
                            {session.dominantEmotion}
                          </span>
                        </td>
                        <td>
                          <span className="text-success fw-bold">
                            {session.positiveRate}%
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {session.total_frames || 0}
                          </span>
                        </td>
                        <td>
                          {Math.round(session.duration_seconds / 60 || 45)}{" "}
                          <small>min</small>
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
                        <td>
                          <a
                            href={`/monitor`}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <i className="fas fa-eye me-1"></i>View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Summary cards */}
        {filteredSessions.length > 0 && (
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Total Sessions</h5>
                  <h3 className="text-primary">{filteredSessions.length}</h3>
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
                        (sum, s) => sum + parseFloat(s.positiveRate || 0),
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
                  <h5 className="card-title">Total Frames</h5>
                  <h3 className="text-info">
                    {filteredSessions.reduce(
                      (sum, s) => sum + (s.total_frames || 0),
                      0
                    )}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Total Duration</h5>
                  <h3 className="text-warning">
                    {Math.round(
                      filteredSessions.reduce(
                        (sum, s) => sum + (s.duration_seconds || 0),
                        0
                      ) / 60
                    )}
                    <small>h</small>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
