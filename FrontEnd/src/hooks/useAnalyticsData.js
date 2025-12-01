import { useState, useCallback } from "react";

/**
 * Hook xử lý session data
 */
export const useAnalyticsData = () => {
  const [barData, setBarData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [lineData, setLineData] = useState([]);
  const [dominantEmotion, setDominantEmotion] = useState("Neutral");
  const [stats, setStats] = useState({
    engagement: 75,
    positive: 68,
  });

  const processSessionData = useCallback((sessionData) => {
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

      const dominantEmotionKey = emotions[counts.indexOf(Math.max(...counts))];
      const emotionMap = {
        Happy: "Vui vẻ",
        Sad: "Buồn",
        Angry: "Giận dữ",
        Surprise: "Ngạc nhiên",
        Neutral: "Bình thường",
        Disgust: "Ghê tởm",
        Fear: "Sợ hãi",
      };
      const maxEmotion = emotionMap[dominantEmotionKey] || "Bình thường";
      setDominantEmotion(maxEmotion);

      const lineChartData = counts.map(() => Math.random() * 100);
      setLineData(lineChartData);

      const totalCount = counts.reduce((a, b) => a + b, 0) || 1;
      const positiveCount = (counts[0] || 0) + (counts[3] || 0);
      const positiveRate =
        totalCount > 0 ? (positiveCount / totalCount) * 100 : 0;

      setStats({
        engagement: Math.round(positiveRate),
        positive: Math.round(positiveRate),
      });
    }
  }, []);

  const enrichSessions = useCallback((sessions) => {
    return sessions.map((session) => {
      let emotionSummary = {};

      if (session.emotion_summary) {
        if (typeof session.emotion_summary === "string") {
          try {
            emotionSummary = JSON.parse(session.emotion_summary);
          } catch (e) {
            console.warn("Failed to parse emotion_summary:", e);
          }
        } else if (typeof session.emotion_summary === "object") {
          emotionSummary = session.emotion_summary;
        }
      }

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
      const dominantEmotionKey =
        emotions[counts.indexOf(Math.max(...counts))] || "Neutral";

      const emotionMap = {
        Happy: "Vui vẻ",
        Sad: "Buồn",
        Angry: "Giận dữ",
        Surprise: "Ngạc nhiên",
        Neutral: "Bình thường",
        Disgust: "Ghê tởm",
        Fear: "Sợ hãi",
      };
      const dominantEmotion = emotionMap[dominantEmotionKey] || "Bình thường";

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
  }, []);

  return {
    barData,
    lineData,
    dominantEmotion,
    stats,
    processSessionData,
    enrichSessions,
  };
};
