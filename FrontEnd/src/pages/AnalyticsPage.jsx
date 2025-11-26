import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

export default function AnalyticsPage() {
  const [data, setData] = useState({
    sessions: [],
    selectedSession: null,
    loading: false,
  });

  return (
    <div className="row mt-4">
      {/* Breadcrumb giống analytics.html */}
      <div className="col-md-12">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/monitor">Class</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Analytics
            </li>
          </ol>
        </nav>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>Class Analytics
              </h4>
              <span className="badge bg-light text-dark">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h5>Demo Subject</h5>
                <p className="text-muted">Teacher ID: T123</p>
              </div>
              <div className="col-md-6 text-end">
                <div className="btn-group">
                  <button className="btn btn-outline-primary">
                    <i className="fas fa-user-check me-1"></i> Attendance
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="fas fa-arrow-left me-1"></i> Back to Class
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="col-md-12">
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="stat-card card p-3 flex-fill">
            <span className="stat-label text-muted">Total Readings</span>
            <span className="stat-value fs-3">120</span>
            <span className="text-muted">data points</span>
          </div>

          <div className="stat-card card p-3 flex-fill">
            <span className="stat-label text-muted">Average Students</span>
            <span className="stat-value fs-3">28.5</span>
            <span className="text-muted">per capture</span>
          </div>

          <div className="stat-card card p-3 flex-fill">
            <span className="stat-label text-muted">Dominant Emotion</span>
            <span className="stat-value fs-3">
              <i className="fas fa-smile text-warning"></i>
            </span>
            <span className="text-warning">{dominantEmotion}</span>
          </div>

          <div className="stat-card card p-3 flex-fill">
            <span className="stat-label text-muted">Class Duration</span>
            <span className="stat-value fs-3">45</span>
            <span className="text-muted">minutes</span>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="col-lg-6">
        <div className="card mb-4" style={{ height: 340 }}>
          <div className="card-body">
            <EmotionBarBox data={barData} />
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card mb-4" style={{ height: 340 }}>
          <div className="card-body">
            <EmotionOverTimeBox lineData={lineData} />
          </div>
        </div>
      </div>

      {/* Teaching Insights */}
      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-lightbulb me-2"></i>Teaching Insights
            </h5>
          </div>
          <div className="card-body">
            <div className="alert alert-warning bg-opacity-10">
              <h5 className="alert-heading">
                <i className="fas fa-smile me-2"></i>Predominant Emotion: Happy
              </h5>
              <p>
                Lớp học đang có xu hướng tích cực. Bạn có thể tận dụng năng
                lượng này để tăng tốc độ giảng hoặc chuyển sang hoạt động nhóm.
              </p>
              <hr />
              <p className="mb-0">
                <strong>Teaching Tip:</strong> Thử đặt câu hỏi mở, cho sinh viên
                chia sẻ cảm nhận để duy trì sự hứng thú.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Notes */}
      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-sticky-note me-2"></i>Class Notes
            </h5>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Class Summary</label>
                <textarea className="form-control" rows="2"></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Detailed Notes</label>
                <textarea className="form-control" rows="5"></textarea>
              </div>
              <div className="text-end">
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-1"></i> Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
