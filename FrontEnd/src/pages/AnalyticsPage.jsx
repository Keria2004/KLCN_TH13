import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import BreadcrumbNav from "../components/analytics/BreadcrumbNav";
import AnalyticsTabs from "../components/analytics/AnalyticsTabs";
import StatsCards from "../components/analytics/StatsCards";
import ChartsSection from "../components/analytics/ChartsSection";
import TableSection from "../components/analytics/TableSection";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { useAnalyticsExport } from "../hooks/useAnalyticsExport";

// Ẩn axios error notifications
axios.interceptors.response.use(
  (response) => response,
  (error) => {
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

  // Analytics hooks
  const {
    barData,
    lineData,
    dominantEmotion,
    stats,
    processSessionData,
    enrichSessions,
  } = useAnalyticsData();
  const { exportPDF, exportCSV, exportJSON, exportAllPDF, exportAllCSV } =
    useAnalyticsExport();

  // UI state
  const [activeTab, setActiveTab] = useState("charts");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [exporting, setExporting] = useState(false);

  // Load initial data
  useEffect(() => {
    const sessionDataStr = localStorage.getItem("lastSessionData");
    if (sessionDataStr) {
      try {
        const sessionData = JSON.parse(sessionDataStr);
        processSessionData(sessionData);
        localStorage.removeItem("lastSessionData");
      } catch (e) {
        console.error("Error loading session data:", e);
      }
    }

    const sessionsListStr = localStorage.getItem("sessionsList");
    if (sessionsListStr) {
      try {
        const sessionsList = JSON.parse(sessionsListStr);
        setData((prev) => ({ ...prev, sessions: sessionsList }));
        localStorage.removeItem("sessionsList");
        return;
      } catch (e) {
        console.warn("Error parsing sessionsList:", e);
      }
    }

    loadRecentSessions();
  }, [processSessionData]);

  // Load recent sessions
  const loadRecentSessions = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(
        `${API_BASE_URL}/sessions/recent_classes`
      );

      if (response.data.data && response.data.data.length > 0) {
        const sessions = response.data.data;
        setData((prev) => ({
          ...prev,
          sessions: sessions,
          loading: false,
        }));

        // Auto-load first session that has emotion data
        const firstSessionWithData = sessions.find(
          (s) => s.emotion_summary && s.emotion_summary !== "null"
        );
        if (firstSessionWithData && firstSessionWithData.id) {
          handleSelectSession(firstSessionWithData.id);
        }
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
          let emotionData = session.emotion_summary;
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

  return (
    <div className="min-vh-100" style={{ background: "#f8f9fa" }}>
      <AnalyticsHeader />

      {/* Main Content */}
      <div className="container py-4">
        <BreadcrumbNav />

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

          <AnalyticsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="card-body p-4">
            {/* Charts Tab */}
            {activeTab === "charts" && (
              <div>
                <StatsCards
                  engagement={stats.engagement}
                  positive={stats.positive}
                  dominantEmotion={dominantEmotion}
                />

                <ChartsSection
                  barData={barData}
                  lineData={lineData}
                  sessions={data.sessions}
                  selectedSession={data.selectedSession}
                  exporting={exporting}
                  onExportPDF={() => {
                    setExporting(true);
                    exportPDF(
                      data.selectedSession,
                      barData,
                      stats,
                      dominantEmotion
                    ).finally(() => setExporting(false));
                  }}
                  onExportCSV={() => {
                    setExporting(true);
                    exportCSV(
                      data.selectedSession,
                      barData,
                      stats,
                      dominantEmotion
                    );
                    setExporting(false);
                  }}
                  onExportJSON={() => {
                    setExporting(true);
                    exportJSON(
                      data.selectedSession,
                      barData,
                      stats,
                      dominantEmotion
                    ).finally(() => setExporting(false));
                  }}
                  onSelectSession={handleSelectSession}
                />
              </div>
            )}

            {/* Table Tab */}
            {activeTab === "table" && (
              <TableSection
                filteredSessions={filteredSessions}
                allSessions={data.sessions}
                filterSubject={filterSubject}
                filterStatus={filterStatus}
                onFilterSubjectChange={setFilterSubject}
                onFilterStatusChange={setFilterStatus}
                onExportPDF={() => {
                  setExporting(true);
                  exportAllPDF(filteredSessions).finally(() =>
                    setExporting(false)
                  );
                }}
                onExportCSV={() => {
                  setExporting(true);
                  exportAllCSV(filteredSessions);
                  setExporting(false);
                }}
                exporting={exporting}
                getEmotionBadgeColor={getEmotionBadgeColor}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
