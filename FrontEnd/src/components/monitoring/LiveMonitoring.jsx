import React, { useRef, useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";
import "../../styles/LiveMonitoring.css";

const LiveMonitoring = ({ onAnalysisExport, onEmotionUpdate }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const overlayCanvasRef = useRef(null); // 🎯 Canvas overlay cho bounding box

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
  const [uploadedVideoFile, setUploadedVideoFile] = useState(null);
  const [isRecordingWebcam, setIsRecordingWebcam] = useState(false);

  const streamRef = useRef(null);
  const analysisRef = useRef(null);
  const isDetectingRef = useRef(false);
  const currentTimeRef = useRef(0);
  const sessionTimelineRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]); // 🎥 Lưu chunks video
  const faceDetectionsRef = useRef([]); // 🎯 Ref để lưu detections (tránh setState loop)
  const lastEmotionUpdateRef = useRef(null); // 🔄 Ref để track last emotion update

  // Video dimensions
  const videoWidth = 640;
  const videoHeight = 480;

  // Start webcam
  // Start webcam
  const startWebcam = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { width: videoWidth, height: videoHeight },
      });

      videoRef.current.srcObject = streamRef.current;
      setStreamMode("webcam");
      setIsStreaming(true);

      // 🎥 Khởi tạo MediaRecorder để ghi webcam
      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        setUploadedVideoFile(blob);
      };
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

    // 🎥 Lưu file video để gửi khi end_session
    setUploadedVideoFile(file);

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
      // 🎥 Dừng ghi webcam nếu đang ghi
      if (mediaRecorderRef.current && isRecordingWebcam) {
        mediaRecorderRef.current.stop();
        setIsRecordingWebcam(false);
      }
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
  const startDetection = async () => {
    if (!isStreaming) {
      alert("Vui lòng khởi động webcam hoặc tải video trước!");
      return;
    }

    // 🆕 Create session in database first
    try {
      const teacherId = localStorage.getItem("user_id") || 1;
      const subject = localStorage.getItem("subject") || "Unknown Subject";

      const response = await axios.post(`${API_BASE_URL}/sessions/create`, {
        teacher_id: parseInt(teacherId),
        subject: subject,
      });

      const sessionId = response.data.session_id;
      localStorage.setItem("session_id", sessionId);
      console.log("✅ Session created in DB:", sessionId);
    } catch (error) {
      console.error("❌ Failed to create session:", error);
      alert("Không thể tạo session. Vui lòng thử lại!");
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

            // ✋ Kiểm tra lại xem còn đang nhận diện không (tránh xử lý khi dừng)
            if (!isDetectingRef.current) return;

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

            // 🎯 Lưu face detections vào ref để vẽ bounding box (tránh setState loop)
            faceDetectionsRef.current = faces || [];

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

              // 🔄 Lưu vào ref để gọi callback sau (tránh setState inside setState)
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

  // 🎥 Hàm gửi session data (có hoặc không có video)
  const sendSessionData = async (sessionData) => {
    // 1️⃣ Lưu vào database thông qua backend
    try {
      console.log("📤 Sending session data to backend:", {
        session_id: sessionData.session_id,
        emotion_counts: sessionData.emotion_counts,
        total_frames: sessionData.timeline?.length || 0,
      });

      const response = await axios.post(
        `${API_BASE_URL}/sessions/end_session`,
        sessionData,
        { timeout: 30000 } // Tăng timeout nếu video lớn
      );

      console.log("✅ Backend response:", response.data);

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

      const totalFrames = Object.values(sessionData.emotion_counts).reduce(
        (a, b) => a + b,
        0
      );

      // 🎥 Save MINIMAL session data to localStorage (avoid quota exceeded)
      const minimalSessionData = {
        session_id: sessionData.session_id,
        subject: sessionData.subject,
        duration: sessionData.duration,
        total_frames: totalFrames,
        emotion_counts: sessionData.emotion_counts,
        start_time: sessionData.start_time,
        end_time: sessionData.end_time,
      };

      try {
        localStorage.setItem(
          "lastSessionData",
          JSON.stringify(minimalSessionData)
        );
      } catch (e) {
        console.warn("Could not save to localStorage:", e.message);
      }

      alert(
        `✅ Buổi học đã kết thúc!\n📊 Đã phân tích ${totalFrames} frame\n💾 Dữ liệu đã lưu vào CSDL\n🎥 Chuyển sang Analytics để xem chi tiết`
      );

      // 3️⃣ Redirect to Analytics
      setTimeout(() => {
        window.location.href = "/analytics";
      }, 500);
    } catch (error) {
      console.error("❌ Error saving session to backend:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Save MINIMAL data to localStorage for offline access
      const minimalSessionData = {
        session_id: sessionData.session_id,
        subject: sessionData.subject,
        duration: sessionData.duration,
        total_frames: Object.values(sessionData.emotion_counts).reduce(
          (a, b) => a + b,
          0
        ),
        emotion_counts: sessionData.emotion_counts,
        start_time: sessionData.start_time,
        end_time: sessionData.end_time,
      };

      try {
        localStorage.setItem(
          "lastSessionData",
          JSON.stringify(minimalSessionData)
        );
      } catch (storageError) {
        console.warn(
          "localStorage full, skipping offline save:",
          storageError.message
        );
      }

      alert(
        `⚠️ Lưu DB thất bại, nhưng dữ liệu vẫn hiển thị.\nLỗi: ${error.message}`
      );

      // Still redirect to Analytics
      setTimeout(() => {
        window.location.href = "/analytics";
      }, 500);
    }
  };

  // End session and save data
  const endSession = async () => {
    // Clear old localStorage data first to free up space (but keep current session_id)
    try {
      const currentSessionId = localStorage.getItem("session_id");
      const keys = Object.keys(localStorage);
      for (let key of keys) {
        if (
          (key.startsWith("session_") && key !== "session_id") ||
          key.includes("video") ||
          key.includes("timeline")
        ) {
          localStorage.removeItem(key);
        }
      }
      // Restore current session_id if it was valid
      if (currentSessionId && !currentSessionId.startsWith("session_")) {
        localStorage.setItem("session_id", currentSessionId);
      }
    } catch (e) {
      console.warn("Could not clear old localStorage data:", e.message);
    }

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

    // Get session_id from localStorage
    const sessionId = localStorage.getItem("session_id");
    console.log("🔍 Ending session with ID:", sessionId);

    if (!sessionId || sessionId.startsWith("session_")) {
      alert("⚠️ Session ID không hợp lệ! Vui lòng bắt đầu lại từ đầu.");
      console.error("Invalid session_id:", sessionId);
      return;
    }

    const sessionData = {
      session_id: parseInt(sessionId), // Convert to number
      subject: localStorage.getItem("subject") || "Unknown",
      start_time: sessionStartTime.toISOString(),
      end_time: new Date().toISOString(),
      duration: Math.round((new Date() - sessionStartTime) / 1000),
      total_frames: totalFrames || finalSessionTimeline.length,
      emotion_counts: emotionCounts,
      timeline: finalSessionTimeline,
    };

    // 🎥 Convert video file to base64 nếu có
    if (uploadedVideoFile) {
      const reader = new FileReader();
      reader.onload = async () => {
        const videoData = reader.result.split(",")[1]; // Lấy phần base64
        sessionData.video_data = videoData;
        await sendSessionData(sessionData);
      };
      reader.readAsDataURL(uploadedVideoFile);
    } else {
      // Gửi mà không có video
      await sendSessionData(sessionData);
    }
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  // 🔄 useEffect để gọi onEmotionUpdate callback sau khi emotionCounts update
  useEffect(() => {
    // ✋ Chỉ cập nhật nếu còn đang nhận diện
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

  // 🎯 useEffect để vẽ bounding box khi có face detections
  useEffect(() => {
    if (!overlayCanvasRef.current || !videoRef.current || !isDetecting) return;

    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    // Animation loop để vẽ liên tục
    let animationFrameId;

    const drawFrame = () => {
      // Get actual video dimensions (metadata dimensions)
      let videoWidth = video.videoWidth;
      let videoHeight = video.videoHeight;

      // Fallback: if videoWidth/Height not available, use display size
      if (!videoWidth || !videoHeight) {
        videoWidth = video.offsetWidth || 640;
        videoHeight = video.offsetHeight || 480;
      }

      // Get display dimensions (rendered size on screen)
      const displayWidth = video.offsetWidth || videoWidth;
      const displayHeight = video.offsetHeight || videoHeight;

      // Calculate scale factor
      const scaleX = displayWidth / videoWidth;
      const scaleY = displayHeight / videoHeight;

      // Update canvas to match display size
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bounding boxes từ ref
      if (faceDetectionsRef.current && faceDetectionsRef.current.length > 0) {
        faceDetectionsRef.current.forEach((face, index) => {
          // Extract bounding box coordinates
          // Backend returns: bbox: [x1, y1, x2, y2] in original frame dimensions
          let x, y, width, height;

          if (face.bbox && Array.isArray(face.bbox)) {
            // Format: [x1, y1, x2, y2] - backend coordinates
            const [x1, y1, x2, y2] = face.bbox;

            // Scale bbox to match display size
            x = x1 * scaleX;
            y = y1 * scaleY;
            width = (x2 - x1) * scaleX;
            height = (y2 - y1) * scaleY;
          } else {
            // Fallback for old format
            x = (face.x || 0) * scaleX;
            y = (face.y || 0) * scaleY;
            width = (face.width || 100) * scaleX;
            height = (face.height || 100) * scaleY;
          }

          // Get emotion color
          const emotionColor = getEmotionColor(face.emotion);

          // Draw rectangle - thiết lập line width tỷ lệ với scale
          ctx.strokeStyle = emotionColor;
          ctx.lineWidth = Math.max(2, 3 * Math.min(scaleX, scaleY));
          ctx.strokeRect(x, y, width, height);

          // Draw emotion text if available
          if (face.emotion) {
            ctx.fillStyle = emotionColor;
            const fontSize = Math.max(12, 16 * Math.min(scaleX, scaleY));
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = "left";
            ctx.fillText(face.emotion, x + 5, y - 5);
          }

          // Draw confidence if available
          if (face.confidence) {
            ctx.fillStyle = "#ffff00";
            const fontSize = Math.max(10, 12 * Math.min(scaleX, scaleY));
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = "left";
            ctx.fillText(
              `${(face.confidence * 100).toFixed(0)}%`,
              x + 5,
              y + height + 15
            );
          }
        });
      }

      // Schedule next frame
      animationFrameId = requestAnimationFrame(drawFrame);
    };

    // Start animation loop
    animationFrameId = requestAnimationFrame(drawFrame);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDetecting]);

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
            {/* 🎯 Canvas overlay để vẽ bounding box */}
            <canvas
              ref={overlayCanvasRef}
              className="video-display"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: isDetecting ? "block" : "none",
                cursor: "crosshair",
              }}
            />
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
                <button
                  className="btn btn-primary btn-lg fw-bold"
                  onClick={startWebcam}
                  style={{ flex: 1, padding: "12px 20px", fontSize: "16px" }}
                >
                  <i className="fas fa-camera me-2"></i>Webcam
                </button>
                <button
                  className="btn btn-info btn-lg fw-bold"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ flex: 1, padding: "12px 20px", fontSize: "16px" }}
                >
                  <i className="fas fa-upload me-2"></i>Tải Video
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

                {/* 🎥 Recording control for webcam */}
                {streamMode === "webcam" && (
                  <button
                    className={`btn ${
                      isRecordingWebcam ? "btn-danger" : "btn-secondary"
                    }`}
                    onClick={() => {
                      if (!isRecordingWebcam) {
                        recordedChunksRef.current = [];
                        mediaRecorderRef.current?.start();
                        setIsRecordingWebcam(true);
                      } else {
                        mediaRecorderRef.current?.stop();
                        setIsRecordingWebcam(false);
                      }
                    }}
                  >
                    <i
                      className={`fas ${
                        isRecordingWebcam ? "fa-stop-circle" : "fa-circle"
                      }`}
                    ></i>
                    {isRecordingWebcam ? " Dừng Ghi" : " Bắt Đầu Ghi"}
                  </button>
                )}

                {isDetecting && (
                  <button className="btn btn-dark" onClick={endSession}>
                    <i className="fas fa-flag-checkered"></i> Kết Thúc Buổi Học
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chart Section - Biểu đồ tròn */}
        <div className="chart-section">
          <div className="chart-header">
            <h5>
              <i className="fas fa-chart-pie"></i> Thống Kê Cảm Xúc
            </h5>
          </div>

          <div className="chart-content">
            {isDetecting && Object.keys(emotionCounts).length > 0 ? (
              <div className="emotion-summary">
                <h6>📊 Tổng Hợp Cảm Xúc</h6>
                <div className="summary-items">
                  {Object.entries(emotionCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, count]) => (
                      <div key={emotion} className="summary-item">
                        <span
                          className={`emotion-tag emotion-${emotion.toLowerCase()}`}
                        >
                          {emotion}
                        </span>
                        <span className="count">{count} frame</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="chart-placeholder">
                <i className="fas fa-chart-pie fa-3x text-muted mb-3"></i>
                <p>Bắt đầu nhận diện để xem biểu đồ cảm xúc</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
