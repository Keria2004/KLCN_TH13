import React from "react";

/**
 * Component button điều khiển
 */
export const ControlButtons = ({
  isStreaming,
  isDetecting,
  isRecordingWebcam,
  streamMode,
  onStartWebcam,
  onVideoUpload,
  onStopStream,
  onStartDetection,
  onStopDetection,
  onToggleRecording,
  onEndSession,
  isSessionActive,
}) => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        {/* Video source buttons */}
        {!isStreaming ? (
          <>
            <button
              onClick={onStartWebcam}
              className="btn btn-lg btn-primary"
              style={{
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              📷 Webcam
            </button>

            <label
              className="btn btn-lg btn-secondary"
              style={{
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                textAlign: "center",
                marginBottom: 0,
              }}
            >
              📹 Tai video
              <input
                type="file"
                accept="video/*"
                onChange={onVideoUpload}
                style={{ display: "none" }}
              />
            </label>
          </>
        ) : (
          <button
            onClick={onStopStream}
            className="btn btn-lg btn-danger"
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            ⏹ Dung
          </button>
        )}
      </div>

      {/* Detection buttons */}
      {isStreaming && !isSessionActive && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          {!isDetecting ? (
            <button
              onClick={onStartDetection}
              className="btn btn-lg btn-success"
              style={{
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              ▶ Phat hien
            </button>
          ) : (
            <button
              onClick={onStopDetection}
              className="btn btn-lg btn-warning"
              style={{
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              ⏸ Tam dung
            </button>
          )}
        </div>
      )}

      {/* Recording toggle (webcam only) */}
      {isStreaming && streamMode === "webcam" && !isSessionActive && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <button
            onClick={onToggleRecording}
            className={`btn btn-lg ${
              isRecordingWebcam ? "btn-danger" : "btn-info"
            }`}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {isRecordingWebcam ? "⏹ Dung ghi" : "⚫ Ghi video"}
          </button>
        </div>
      )}

      {/* Session end button */}
      {isSessionActive && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "10px",
          }}
        >
          <button
            onClick={onEndSession}
            className="btn btn-lg btn-danger"
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            🛑 Ket thuc
          </button>
        </div>
      )}
    </div>
  );
};
