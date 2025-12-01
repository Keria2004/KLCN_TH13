import React from "react";
import "../../styles.css";

/**
 * Component hiển thị video + canvas overlay
 */
export const VideoDisplay = React.forwardRef(
  (
    {
      videoRef,
      canvasRef,
      isStreaming,
      currentTime,
      videoDuration,
      streamMode,
      faceCount,
      onVideoTimeChange,
    },
    ref
  ) => {
    const formatTime = (seconds) => {
      if (!seconds) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${String(secs).padStart(2, "0")}`;
    };

    return (
      <div
        className="video-container"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "640px",
          margin: "0 auto",
          backgroundColor: "#000",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="video-player"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />

        <canvas
          ref={canvasRef}
          className="detection-canvas"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {streamMode === "video" && videoDuration > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              right: "10px",
              backgroundColor: "rgba(0,0,0,0.7)",
              borderRadius: "4px",
              padding: "8px",
              color: "white",
              fontSize: "12px",
            }}
          >
            <div style={{ marginBottom: "6px" }}>
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </div>
            <input
              type="range"
              min="0"
              max={videoDuration || 0}
              value={currentTime}
              onChange={(e) => {
                const time = parseFloat(e.target.value);
                onVideoTimeChange?.(time);
                if (videoRef?.current) {
                  videoRef.current.currentTime = time;
                }
              }}
              style={{
                width: "100%",
                cursor: "pointer",
              }}
            />
          </div>
        )}

        {isStreaming && faceCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#28a745",
              color: "white",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Phát hiện: {faceCount} khuon mat
          </div>
        )}
      </div>
    );
  }
);

VideoDisplay.displayName = "VideoDisplay";
