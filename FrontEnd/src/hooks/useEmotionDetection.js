import { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

/**
 * Hook quản lý phân tích cảm xúc
 */
export const useEmotionDetection = (
  isStreaming,
  streamMode,
  videoRef,
  canvasRef,
  onEmotionUpdate
) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("Neutral");
  const [positiveRate, setPositiveRate] = useState(0);
  const [faceCount, setFaceCount] = useState(0);
  const [emotionCounts, setEmotionCounts] = useState({});
  const [sessionStartTime, setSessionStartTime] = useState(null);

  const isDetectingRef = useRef(false);
  const analysisRef = useRef(null);
  const currentTimeRef = useRef(0);
  const faceDetectionsRef = useRef([]);
  const lastEmotionUpdateRef = useRef(null);

  const startDetection = () => {
    if (!isStreaming) {
      alert("Vui lòng khởi động webcam hoặc tải video trước!");
      return;
    }

    isDetectingRef.current = true;
    setIsDetecting(true);
    setSessionStartTime(new Date());
    setEmotionCounts({});

    if (streamMode === "video") {
      videoRef.current
        ?.play()
        .catch((err) => console.error("Play error:", err));
    }

    analyzeVideo();
  };

  const stopDetection = () => {
    isDetectingRef.current = false;
    setIsDetecting(false);

    if (streamMode === "video" && videoRef.current) {
      videoRef.current.pause();
    }

    if (analysisRef.current) {
      clearTimeout(analysisRef.current);
    }
  };

  const analyzeVideo = useCallback(async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !isStreaming ||
      !isDetectingRef.current
    ) {
      return;
    }

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const video = videoRef.current;

      if (streamMode === "video") {
        currentTimeRef.current = Math.round(video.currentTime);

        if (video.ended) {
          isDetectingRef.current = false;
          setIsDetecting(false);
          return;
        }
      }

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      try {
        ctx.drawImage(video, 0, 0);
      } catch (e) {
        console.error("Canvas draw error:", e);
        analysisRef.current = setTimeout(() => analyzeVideo(), 500);
        return;
      }

      canvas.toBlob(
        async (blob) => {
          if (!blob || !isDetectingRef.current) return;

          const formData = new FormData();
          formData.append("file", blob, "frame.jpg");

          try {
            const response = await axios.post(
              `${API_BASE_URL}/monitoring/frame`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 10000,
              }
            );

            if (!isDetectingRef.current) return;

            const {
              current_emotion,
              positive_rate,
              faces,
              emotion_distribution,
            } = response.data;

            setCurrentEmotion(current_emotion);
            setPositiveRate(positive_rate);
            setFaceCount(faces ? faces.length : 0);

            faceDetectionsRef.current = faces || [];

            setEmotionCounts((prev) => {
              const updated = {
                ...prev,
                [current_emotion]: (prev[current_emotion] || 0) + 1,
              };

              const emotionArray = [
                updated["Happy"] || 0,
                updated["Sad"] || 0,
                updated["Angry"] || 0,
                updated["Surprise"] || 0,
                updated["Neutral"] || 0,
                updated["Disgust"] || 0,
                updated["Fear"] || 0,
              ];

              const totalFrames = emotionArray.reduce((a, b) => a + b, 0) || 1;
              const positiveCount =
                (updated["Happy"] || 0) + (updated["Surprise"] || 0);
              const positiveRate = (
                (positiveCount / totalFrames) *
                100
              ).toFixed(0);

              lastEmotionUpdateRef.current = {
                emotionArray,
                current_emotion,
                stats: {
                  engagement: positiveRate,
                  positive: positiveRate,
                },
              };

              return updated;
            });
          } catch (error) {
            console.error("Analysis error:", error.message);
          }

          if (isDetectingRef.current) {
            const interval = streamMode === "video" ? 300 : 500;
            analysisRef.current = setTimeout(() => analyzeVideo(), interval);
          } else {
            analysisRef.current = null;
          }
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("Error in analyzeVideo:", error);
      if (isDetectingRef.current) {
        analysisRef.current = setTimeout(() => analyzeVideo(), 500);
      }
    }
  }, [isStreaming, streamMode]);

  // Gọi onEmotionUpdate từ ref
  useEffect(() => {
    if (
      lastEmotionUpdateRef.current &&
      onEmotionUpdate &&
      isDetectingRef.current
    ) {
      const { emotionArray, current_emotion, stats } =
        lastEmotionUpdateRef.current;
      onEmotionUpdate(emotionArray, current_emotion, stats);
      lastEmotionUpdateRef.current = null;
    }
  }, [emotionCounts, onEmotionUpdate]);

  const getEmotionColor = (emotion) => {
    const colors = {
      Happy: "#28a745",
      Surprise: "#ffc107",
      Neutral: "#6c757d",
      Sad: "#007bff",
      Angry: "#dc3545",
      Disgust: "#e83e8c",
      Fear: "#fd7e14",
    };
    return colors[emotion] || "#6c757d";
  };

  return {
    isDetecting,
    currentEmotion,
    positiveRate,
    faceCount,
    emotionCounts,
    sessionStartTime,
    isDetectingRef,
    analysisRef,
    faceDetectionsRef,
    startDetection,
    stopDetection,
    analyzeVideo,
    getEmotionColor,
  };
};
