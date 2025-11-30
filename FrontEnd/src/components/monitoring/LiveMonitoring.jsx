import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";
import "../../styles/LiveMonitoring.css";

const LiveMonitoring = ({ onAnalysisExport, onEmotionUpdate }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // State management
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [streamMode, setStreamMode] = useState(null); // 'webcam' | 'video'
  const [currentEmotion, setCurrentEmotion] = useState("Neutral");
  const [positiveRate, setPositiveRate] = useState(0);
  const [faceCount, setFaceCount] = useState(0);
  const [emotionDist, setEmotionDist] = useState({});
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sessionTimeline, setSessionTimeline] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [emotionCounts, setEmotionCounts] = useState({});

  const streamRef = useRef(null);
  const analysisRef = useRef(null);
  const isDetectingRef = useRef(false);
  const currentTimeRef = useRef(0);
  const sessionTimelineRef = useRef([]);

  // Start webcam
  // Start webcam
  const startWebcam = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      videoRef.current.srcObject = streamRef.current;
      setStreamMode("webcam");
      setIsStreaming(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  // Upload and play video file
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "video/mp4",
      "video/avi",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Vui lòng tải lên file video hợp lệ (MP4, AVI, MOV, WebM)");
      return;
    }

    const url = URL.createObjectURL(file);
    videoRef.current.src = url;
    videoRef.current.srcObject = null;
    setStreamMode("video");
    setIsStreaming(true);

    // Metadata loaded handler
    videoRef.current.onloadedmetadata = () => {
      setVideoDuration(Math.round(videoRef.current.duration));
    };
  };

  // Stop streaming
  const stopStream = () => {
    if (streamMode === "webcam" && streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    } else if (streamMode === "video" && videoRef.current) {
      videoRef.current.pause();
    }

    setIsStreaming(false);
    setIsDetecting(false);
    setStreamMode(null);

    if (analysisRef.current) {
      clearTimeout(analysisRef.current);
    }
  };

  // Start detection
  const startDetection = () => {
    if (!isStreaming) {
      alert("Vui lòng khởi động webcam hoặc tải video trước!");
      return;
    }

    isDetectingRef.current = true;
    setIsDetecting(true);
    setSessionStartTime(new Date());
    setSessionTimeline([]);
    setEmotionCounts({});
    sessionTimelineRef.current = [];

    if (streamMode === "video") {
      videoRef.current.play().catch((err) => console.error("Play error:", err));
    }

    analyzeVideo();
  };

  // Stop detection
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

  // Main analysis loop
  const analyzeVideo = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !isStreaming ||
      !isDetectingRef.current
    )
      return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const video = videoRef.current;

      // Update video time
      if (streamMode === "video") {
        currentTimeRef.current = Math.round(video.currentTime);
        setCurrentTime(currentTimeRef.current);

        // Check if video ended
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

      // Convert canvas to blob
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

            const {
              current_emotion,
              positive_rate,
              faces,
              emotion_distribution,
            } = response.data;

            // Update current state
            setCurrentEmotion(current_emotion);
            setPositiveRate(positive_rate);
            setFaceCount(faces ? faces.length : 0);
            setEmotionDist(emotion_distribution || {});

            // Update emotion counts
            setEmotionCounts((prev) => {
              const updated = {
                ...prev,
                [current_emotion]: (prev[current_emotion] || 0) + 1,
              };

              // Convert emotionCounts to array format for parent component
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

              // Notify parent with emotion data
              if (onEmotionUpdate) {
                onEmotionUpdate(emotionArray, current_emotion, {
                  engagement: positiveRate,
                  positive: positiveRate,
                });
              }

              return updated;
            });
          } catch (error) {
            console.error("Analysis error:", error.message);
          }

          // Schedule next analysis
          if (isDetectingRef.current) {
            const interval = streamMode === "video" ? 300 : 500; // 3 FPS for video, 2 FPS for webcam
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
  };

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // End session and save data
  const endSession = async () => {
    // Check if emotionCounts has any data instead of sessionTimeline
    const hasEmotionData =
      Object.keys(emotionCounts).length > 0 &&
      Object.values(emotionCounts).some((count) => count > 0);

    if (!hasEmotionData) {
      alert(
        "Không có dữ liệu cảm xúc để lưu. Vui lòng bắt đầu nhận diện trước!"
      );
      return;
    }

    stopDetection();
    stopStream();

    // Prepare session data - use emotionCounts if sessionTimeline is empty
    const finalSessionTimeline =
      sessionTimelineRef.current.length > 0 ? sessionTimelineRef.current : [];
    const totalFrames = Object.values(emotionCounts).reduce((a, b) => a + b, 0);

    const sessionData = {
      session_id:
        localStorage.getItem("session_id") || `session_${new Date().getTime()}`,
      subject: localStorage.getItem("subject") || "Unknown",
      start_time: sessionStartTime.toISOString(),
      end_time: new Date().toISOString(),
      duration: Math.round((new Date() - sessionStartTime) / 1000),
      total_frames: totalFrames || finalSessionTimeline.length,
      emotion_counts: emotionCounts,
      timeline: finalSessionTimeline,
    };

    // 1️⃣ Lưu vào database thông qua backend
    try {
      const response = await axios.post(
        `${API_BASE_URL}/sessions/end_session`,
        sessionData,
        { timeout: 10000 }
      );

      // Save to localStorage for Analytics page
      localStorage.setItem("lastSessionData", JSON.stringify(sessionData));

      // 2️⃣ Fetch updated sessions list từ backend
      try {
        const sessionsResponse = await axios.get(
          `${API_BASE_URL}/sessions/recent_classes`
        );
        if (sessionsResponse.data.data) {
          localStorage.setItem(
            "sessionsList",
            JSON.stringify(sessionsResponse.data.data)
          );
        }
      } catch (sessionsError) {
        console.warn("Could not reload sessions list:", sessionsError.message);
      }

      alert(
        `✅ Buổi học đã kết thúc!\n📊 Đã phân tích ${totalFrames} frame\n💾 Dữ liệu đã lưu vào CSDL\n🎥 Chuyển sang Analytics để xem chi tiết`
      );

      // 3️⃣ Redirect to Analytics
      setTimeout(() => {
        window.location.href = "/analytics";
      }, 500);
    } catch (error) {
      console.error("❌ Error saving session to backend:", error.message);

      // Save to localStorage anyway for offline access
      localStorage.setItem("lastSessionData", JSON.stringify(sessionData));

      alert(
        `⚠️ Lưu DB thất bại, nhưng dữ liệu vẫn hiển thị.\nLỗi: ${error.message}`
      );

      // Still redirect to Analytics
      setTimeout(() => {
        window.location.href = "/analytics";
      }, 500);
    }

    // Reset
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return (
    <div className="live-monitoring-container">
      <div className="monitoring-layout">
        {/* Video Section */}
        <div className="video-section">
          <div className="video-header">
            <h5>
              <i className="fas fa-video"></i>{" "}
              {streamMode === "webcam" ? "Webcam Trực Tiếp" : "Tải Video"}
            </h5>
            {isDetecting && (
              <span className="badge bg-danger">
                <span className="pulse"></span> Đang nhận diện
              </span>
            )}
          </div>

          <div className="video-wrapper">
            <video
              ref={videoRef}
              className="video-display"
              style={{ display: isStreaming ? "block" : "none" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {!isStreaming && (
              <div className="video-placeholder">
                <i className="fas fa-video fa-3x text-muted mb-3"></i>
                <p>Khởi động Webcam hoặc Tải Video</p>
              </div>
            )}
          </div>

          {/* Video Timer */}
          {streamMode === "video" && isStreaming && (
            <div className="video-time-display">
              <span>
                ⏱️ {currentTime}s / {videoDuration}s
              </span>
            </div>
          )}

          {/* Emotion Display */}
          {isDetecting && (
            <div className="emotion-display">
              <div className="emotion-main">
                <span className="emotion-label">Cảm xúc:</span>
                <span
                  className={`emotion-value emotion-${currentEmotion.toLowerCase()}`}
                >
                  {currentEmotion}
                </span>
              </div>
              <div className="emotion-stats">
                <div className="stat-item">
                  <span className="stat-label">😊 Tích cực:</span>
                  <span className="stat-value">{positiveRate}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">👥 Khuôn mặt:</span>
                  <span className="stat-value">{faceCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="button-group">
            {!isStreaming ? (
              <>
                <button className="btn btn-primary" onClick={startWebcam}>
                  <i className="fas fa-camera"></i> Webcam
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="fas fa-upload"></i> Tải Video
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ display: "none" }}
                />
              </>
            ) : (
              <>
                {!isDetecting ? (
                  <button className="btn btn-success" onClick={startDetection}>
                    <i className="fas fa-play"></i> Bắt Đầu
                  </button>
                ) : (
                  <button className="btn btn-warning" onClick={stopDetection}>
                    <i className="fas fa-pause"></i> Tạm Dừng
                  </button>
                )}

                <button className="btn btn-danger" onClick={stopStream}>
                  <i className="fas fa-stop"></i> Dừng Luồng
                </button>

                {isDetecting && (
                  <button className="btn btn-dark" onClick={endSession}>
                    <i className="fas fa-flag-checkered"></i> Kết Thúc Buổi Học
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
