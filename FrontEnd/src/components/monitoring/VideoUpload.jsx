import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";
import "../../styles/VideoUpload.css";

const VideoUpload = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "video/mp4",
        "video/avi",
        "video/quicktime",
        "video/x-msvideo",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Invalid file type. Please upload MP4, AVI, or MOV file.");
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("frame_step", "5"); // Analyze every 5th frame

      const response = await axios.post(
        `${API_BASE_URL}/monitoring/upload-video/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );

      setResult(response.data);
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data);
      }
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error.response?.data?.detail || error.message || "Error uploading video"
      );
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="video-upload-container">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">📤 Upload Video for Analysis</h5>
        </div>
        <div className="card-body">
          {/* File Input */}
          <div className="mb-3">
            <label className="form-label">Select Video File</label>
            <input
              type="file"
              className="form-control"
              accept="video/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            <small className="text-muted d-block mt-2">
              Supported formats: MP4, AVI, MOV (Max 500MB)
            </small>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
              ></button>
            </div>
          )}

          {/* Selected File Display */}
          {file && !result && (
            <div className="alert alert-info mb-3">
              <strong>Selected:</strong> {file.name} (
              {(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}

          {/* Upload Progress */}
          {loading && (
            <div className="mb-3">
              <label className="form-label">Upload Progress</label>
              <div className="progress" style={{ height: "30px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {progress}%
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            className="btn btn-success btn-lg w-100"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Analyzing...
              </>
            ) : (
              <>
                <i className="fas fa-upload me-2"></i>
                Analyze Video
              </>
            )}
          </button>

          {/* Results */}
          {result && (
            <div className="alert alert-success mt-3">
              <h6 className="mb-2">✅ Analysis Complete!</h6>
              <ul className="mb-0">
                <li>Total Frames: {result.frames_total}</li>
                <li>Analyzed: {result.frames_analyzed}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
