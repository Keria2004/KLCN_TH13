import { useEffect, useState } from "react";
import API_BASE_URL from "../config/apiConfig";

export default function HomePage() {
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [cameraIndex, setCameraIndex] = useState("0");
  const [cameras, setCameras] = useState(["0"]);
  const [tab, setTab] = useState("new"); // "new" | "continue"
  const [recentClasses, setRecentClasses] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);

  // Load recent classes with error handling
  useEffect(() => {
    async function loadRecent() {
      setLoadingRecent(true);
      try {
        const res = await fetch(`${API_BASE_URL}/sessions/recent_classes`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setRecentClasses(data.data || []);
        setBackendConnected(true);
      } catch (err) {
        console.warn("Cannot connect to backend:", err.message);
        setRecentClasses([]);
        setBackendConnected(false);
      } finally {
        setLoadingRecent(false);
      }
    }

    // Load on mount and retry every 10 seconds
    loadRecent();
    const interval = setInterval(loadRecent, 10000);
    return () => clearInterval(interval);
  }, []);

  // Demo: teacher từ localStorage/cookie… tùy bạn
  const teacherName = localStorage.getItem("teacher_name") || "Unknown";
  const teacherId = localStorage.getItem("teacher_id") || "N/A";

  const handleStartClass = async (e) => {
    e.preventDefault();
    setError("");

    if (!backendConnected) {
      setError(
        "❌ Backend server is not connected. Please start the backend server first."
      );
      return;
    }

    if (!subject.trim()) {
      setError("Please enter a class subject");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const teacherId = localStorage.getItem("teacher_id") || "1";

      const res = await fetch(`${API_BASE_URL}/sessions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          subject: subject,
          teacher_id: parseInt(teacherId),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Cannot create class");

      localStorage.setItem("session_id", data.session_id);
      setSubject("");
      window.location.href = "/monitor";
    } catch (err) {
      console.error("Error starting class:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleContinue = (cls) => {
    // tuỳ backend: set cookie / localStorage / navigate
    console.log("Continue class", cls);
    window.location.href = "/monitor";
  };

  return (
    <div className="row mt-5 mb-4">
      <div className="col-md-12 text-center">
        <h1 className="display-4 fw-bold text-primary">Smart Classroom</h1>
        <p className="lead">
          Enhance teaching effectiveness through real-time emotion monitoring
        </p>
      </div>

      <div className="col-lg-6 mt-4">
        {/* Start a New Class card */}
        <div className="card mb-4">
          <div className="card-header">
            <h4 className="mb-0">
              <i className="fas fa-chalkboard-teacher me-2"></i>Start a New
              Class
            </h4>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {/* Tabs */}
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${tab === "new" ? "active" : ""}`}
                  type="button"
                  onClick={() => setTab("new")}
                >
                  <i className="fas fa-plus me-1"></i>New Class
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${tab === "continue" ? "active" : ""}`}
                  type="button"
                  onClick={() => setTab("continue")}
                >
                  <i className="fas fa-play me-1"></i>Continue Class
                </button>
              </li>
            </ul>

            <div className="tab-content mt-3">
              {/* New Class */}
              {tab === "new" && (
                <div className="tab-pane fade show active">
                  <form onSubmit={handleStartClass}>
                    <div className="mb-3">
                      <label className="form-label">Teacher:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={`${teacherName} (${teacherId})`}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Subject:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter subject name"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Select Camera:</label>
                      <select
                        className="form-select"
                        value={cameraIndex}
                        onChange={(e) => setCameraIndex(e.target.value)}
                      >
                        {cameras.map((cam) => (
                          <option key={cam} value={cam}>
                            Camera {cam}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                      <button type="submit" className="btn btn-success btn-lg">
                        <i className="fas fa-play-circle me-2"></i>
                        Start New Class
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Continue Class */}
              {tab === "continue" && (
                <div className="tab-pane fade show active">
                  <div className="mt-3" id="recent-classes-list">
                    {recentClasses.length === 0 ? (
                      <div className="alert alert-info text-center">
                        <i className="fas fa-info-circle fa-2x mb-2"></i>
                        <h5>No Recent Classes</h5>
                        <p>
                          Start your first class using the &quot;New Class&quot;
                          tab.
                        </p>
                      </div>
                    ) : (
                      <div className="row g-3">
                        {recentClasses.slice(0, 6).map((cls) => (
                          <div className="col-md-6" key={cls.id}>
                            <div className="card class-card">
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6 className="card-title mb-1">
                                    {cls.subject}
                                  </h6>
                                  <span className="badge bg-secondary">
                                    {cls.dominant_emotion}
                                  </span>
                                </div>
                                <p className="card-text text-muted small mb-2">
                                  <i className="fas fa-user me-1"></i>
                                  {cls.teacher_id} •{" "}
                                  <i className="fas fa-clock me-1"></i>
                                  {cls.date}
                                </p>
                                <div className="btn-group w-100">
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleContinue(cls)}
                                  >
                                    <i className="fas fa-play me-1"></i>Continue
                                  </button>
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() =>
                                      (window.location.href = `/analytics?classId=${cls.id}`)
                                    }
                                  >
                                    <i className="fas fa-chart-line"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Management Tools */}
        <div className="card">
          <div className="card-header">
            <h4 className="mb-0">
              <i className="fas fa-cog me-2"></i>Management Tools
            </h4>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <button className="btn btn-outline-primary d-block py-3 w-100">
                  <i className="fas fa-user-graduate fa-2x mb-2"></i>
                  <br />
                  Manage Students
                </button>
              </div>

              <div className="col-md-6">
                <button className="btn btn-outline-secondary d-block py-3 w-100">
                  <i className="fas fa-history fa-2x mb-2"></i>
                  <br />
                  Recent Classes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: About Smart Classroom */}
      <div className="col-lg-6 mt-4">
        <div className="card mb-4">
          <div className="card-header">
            <h4 className="mb-0">
              <i className="fas fa-info-circle me-2"></i>About Smart Classroom
            </h4>
          </div>
          <div className="card-body">
            <p>
              Smart Classroom uses advanced emotion recognition technology to
              help teachers understand their students&apos; engagement and
              emotional responses during class in real-time.
            </p>

            <h5 className="mt-4">Key Features:</h5>
            <div className="row mt-3 g-3">
              {/* Bạn có thể giữ nguyên 4 ô feature giống html gốc */}
              {/* ... rút gọn cho ngắn */}
              <div className="col-md-6">
                <div className="feature-card p-3 border rounded">
                  <div className="d-flex align-items-center mb-2">
                    <div className="feature-icon me-3 text-primary">
                      <i className="fas fa-camera"></i>
                    </div>
                    <h6 className="mb-0">Real-time Emotion Detection</h6>
                  </div>
                  <p className="text-muted small mb-0">
                    Analyzes facial expressions to determine emotional states
                    during class.
                  </p>
                </div>
              </div>
              {/* Thêm 3 card còn lại tương tự... */}
            </div>

            <div className="alert alert-info mt-4 mb-0">
              <i className="fas fa-lock me-2"></i>
              <strong>Privacy Notice:</strong> All emotion data is processed
              locally and is only used to provide feedback to the teacher. No
              personal data is stored or shared with third parties.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
