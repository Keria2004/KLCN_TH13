// src/components/monitoring/CameraBox.jsx
import { useRef } from "react";

export default function CameraBox({
  videoRef,
  canvasRef,
  onUseCamera,
  onUploadVideo,
  onStopStream,
  isCameraActive,
  videoSource,
}) {
  const fileInputRef = useRef(null);

  const statusLabel =
    videoSource === "camera"
      ? "Camera"
      : videoSource === "file"
      ? "Tệp Video"
      : "Rảnh";

  return (
    <div>
      {/* Status (nhỏ, không trùng với header của card) */}
      <div className="d-flex justify-content-end mb-2">
        <span className="badge bg-secondary text-uppercase">{statusLabel}</span>
      </div>

      {/* VIDEO + CANVAS */}
      <div className="ratio ratio-16x9 border rounded bg-dark position-relative overflow-hidden mb-3">
        <video
          id="cam-video"
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
        <canvas
          id="cam-canvas"
          ref={canvasRef}
          className="position-absolute top-0 start-0 w-100 h-100"
        />
      </div>

      {/* CONTROLS */}
      <div className="d-flex flex-wrap gap-2">
        {/* CONNECT CAMERA */}
        <button
          type="button"
          className={`btn btn-sm ${
            videoSource === "camera" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={onUseCamera}
        >
          <i className="fas fa-plug me-1"></i>
          Kết Nối Camera
        </button>

        {/* TẢI VIDEO */}
        <button
          type="button"
          className={`btn btn-sm ${
            videoSource === "file" ? "btn-primary" : "btn-outline-secondary"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <i className="fas fa-upload me-1"></i>
          Tải Video
        </button>

        <input
          ref={fileInputRef}
          id="video-upload"
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={onUploadVideo}
        />

        {/* DỪNG */}
        {isCameraActive && (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-auto"
            onClick={onStopStream}
          >
            <i className="fas fa-stop-circle me-1"></i>
            Dừng
          </button>
        )}
      </div>
    </div>
  );
}
