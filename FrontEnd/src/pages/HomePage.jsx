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
        const res = await fetch(`${API_BASE_URL}/sessions/recent`);
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

    loadRecent();
    const interval = setInterval(loadRecent, 10000);
    return () => clearInterval(interval);
  }, []);

  const teacherName = localStorage.getItem("teacher_name") || "Unknown";
  const teacherId = localStorage.getItem("teacher_id") || "N/A";

  const handleStartClass = async (e) => {
    e.preventDefault();
    setError("");

    const currentTeacherId = localStorage.getItem("teacher_id");
    if (
      !currentTeacherId ||
      currentTeacherId === "N/A" ||
      currentTeacherId === "0"
    ) {
      setError("Vui lòng đăng nhập để tạo lớp học");
      return;
    }

    if (!backendConnected) {
      setError("Máy chủ không kết nối. Vui lòng khởi động máy chủ trước.");
      return;
    }

    if (!subject.trim()) {
      setError("Vui lòng nhập môn học");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/sessions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          subject: subject,
          teacher_id: parseInt(currentTeacherId),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Cannot create class");

      localStorage.setItem("session_id", data.session_id);
      setSubject("");
      window.location.href = "/monitor";
    } catch (err) {
      console.error("Error starting class:", err);
      setError(`Lỗi: ${err.message}`);
    }
  };

  const handleContinue = (cls) => {
    window.location.href = "/monitor";
  };

  return (
    <div className="min-vh-100" style={{ background: "#f8f9fa" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "60px 20px",
        }}
      >
        <div className="container">
          <div className="text-center">
            <h1 className="display-5 fw-bold mb-2">Lớp Học Thông Minh</h1>
            <p className="lead mb-0" style={{ opacity: 0.9 }}>
              Nâng cao hiệu quả giảng dạy nhờ gán sát cảm xúc thời gian thực
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Login Warning Banner */}
        {(!teacherId || teacherId === "N/A" || teacherId === "0") && (
          <div className="row mb-4">
            <div className="col-12">
              <div
                className="alert alert-warning alert-dismissible fade show d-flex align-items-center"
                role="alert"
                style={{ borderRadius: "10px", border: "2px solid #fff3cd" }}
              >
                <i
                  className="fas fa-exclamation-triangle me-3 fa-lg"
                  style={{ color: "#856404" }}
                ></i>
                <div className="flex-grow-1">
                  <strong>Cảnh báo!</strong> Bạn chưa đăng nhập. Vui lòng{" "}
                  <a href="/login" className="alert-link ms-1 fw-bold">
                    đăng nhập
                  </a>{" "}
                  để tạo lớp học.
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
        )}

        <div className="row g-4">
          {/* Left: Start a New Class card */}
          <div className="col-lg-6">
            <div
              className="card shadow-sm border-0 h-100"
              style={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "20px",
                }}
              >
                <h4 className="mb-0">
                  <i className="fas fa-chalkboard-teacher me-2"></i>Bắt Đầu Buổi
                  Học Mới
                </h4>
              </div>
              <div className="card-body p-4">
                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show d-flex align-items-start"
                    role="alert"
                    style={{ borderRadius: "8px" }}
                  >
                    <i
                      className="fas fa-exclamation-circle me-2 mt-1"
                      style={{ color: "#721c24" }}
                    ></i>
                    <div className="flex-grow-1">
                      <strong>Lỗi!</strong> {error}
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError("")}
                    ></button>
                  </div>
                )}

                {/* Tabs */}
                <ul
                  className="nav nav-pills nav-fill gap-2 mb-3"
                  role="tablist"
                  style={{ borderBottom: "none" }}
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link fw-bold py-2 ${
                        tab === "new" ? "active" : ""
                      }`}
                      type="button"
                      onClick={() => setTab("new")}
                      style={{
                        borderRadius: "8px",
                        color: tab === "new" ? "white" : "#667eea",
                        background:
                          tab === "new"
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "#f0f0f0",
                        border: "none",
                        transition: "all 0.3s",
                      }}
                    >
                      <i className="fas fa-plus me-1"></i>Buổi Học Mới
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link fw-bold py-2 ${
                        tab === "continue" ? "active" : ""
                      }`}
                      type="button"
                      onClick={() => setTab("continue")}
                      style={{
                        borderRadius: "8px",
                        color: tab === "continue" ? "white" : "#667eea",
                        background:
                          tab === "continue"
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "#f0f0f0",
                        border: "none",
                        transition: "all 0.3s",
                      }}
                    >
                      <i className="fas fa-play me-1"></i>Tiếp Tục
                    </button>
                  </li>
                </ul>

                <div className="tab-content mt-4">
                  {/* New Class */}
                  {tab === "new" && (
                    <form onSubmit={handleStartClass}>
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">
                          Giáo Viên
                        </label>
                        <div
                          className="input-group"
                          style={{ borderRadius: "8px", overflow: "hidden" }}
                        >
                          <span
                            className="input-group-text bg-light border-0"
                            style={{ color: "#667eea" }}
                          >
                            <i className="fas fa-user"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-0"
                            value={`${teacherName} (${teacherId})`}
                            readOnly
                            style={{ background: "#f8f9fa" }}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">
                          Môn Học
                        </label>
                        <div
                          className="input-group"
                          style={{ borderRadius: "8px", overflow: "hidden" }}
                        >
                          <span
                            className="input-group-text bg-light border-0"
                            style={{ color: "#667eea" }}
                          >
                            <i className="fas fa-book"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-0"
                            placeholder="Nhập tên môn học"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={{ background: "#f8f9fa" }}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">
                          Chọn Camera
                        </label>
                        <select
                          className="form-select border-0"
                          value={cameraIndex}
                          onChange={(e) => setCameraIndex(e.target.value)}
                          style={{
                            background: "#f8f9fa",
                            borderRadius: "8px",
                            color: "#667eea",
                          }}
                        >
                          {cameras.map((cam) => (
                            <option key={cam} value={cam}>
                              Camera {cam}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="btn w-100 fw-bold py-2"
                        disabled={
                          !teacherId || teacherId === "N/A" || teacherId === "0"
                        }
                        title={
                          !teacherId || teacherId === "N/A" || teacherId === "0"
                            ? "Vui lòng đăng nhập trước"
                            : ""
                        }
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          opacity:
                            !teacherId ||
                            teacherId === "N/A" ||
                            teacherId === "0"
                              ? 0.5
                              : 1,
                        }}
                      >
                        <i className="fas fa-play-circle me-2"></i>Bắt Đầu Buổi
                        Học Mới
                      </button>
                    </form>
                  )}

                  {/* Continue Class */}
                  {tab === "continue" && (
                    <div>
                      {recentClasses.length === 0 ? (
                        <div
                          className="alert alert-info text-center"
                          style={{ borderRadius: "10px" }}
                        >
                          <i
                            className="fas fa-info-circle fa-2x mb-2"
                            style={{ color: "#0c5460" }}
                          ></i>
                          <h5 className="mt-2">Không Có Buổi Học Gần Đây</h5>
                          <p className="mb-0">
                            Hãy bắt đầu buổi học đầu tiên của bạn.
                          </p>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {recentClasses.slice(0, 4).map((cls) => (
                            <div className="col-md-6" key={cls.id}>
                              <div
                                className="card h-100 shadow-sm"
                                style={{
                                  borderRadius: "10px",
                                  border: "1px solid #e0e0e0",
                                }}
                              >
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6
                                      className="card-title mb-0 fw-bold"
                                      style={{ color: "#667eea" }}
                                    >
                                      {cls.subject}
                                    </h6>
                                    <span
                                      className="badge"
                                      style={{
                                        background:
                                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                      }}
                                    >
                                      {cls.dominant_emotion}
                                    </span>
                                  </div>
                                  <p className="card-text text-muted small mb-3">
                                    <i
                                      className="fas fa-user me-1"
                                      style={{ color: "#667eea" }}
                                    ></i>
                                    {cls.teacher_id} •{" "}
                                    <i
                                      className="fas fa-clock me-1"
                                      style={{ color: "#667eea" }}
                                    ></i>
                                    {cls.date}
                                  </p>
                                  <button
                                    className="btn btn-sm w-100"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                    }}
                                    onClick={() => handleContinue(cls)}
                                  >
                                    <i className="fas fa-play me-1"></i>Tiếp Tục
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: About Smart Classroom */}
          <div className="col-lg-6">
            <div
              className="card shadow-sm border-0 h-100"
              style={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                  color: "white",
                  padding: "20px",
                }}
              >
                <h4 className="mb-0">
                  <i className="fas fa-lightbulb me-2"></i>Về Lớp Học Thông Minh
                </h4>
              </div>
              <div className="card-body p-4">
                <p>
                  Lớp Học Thông Minh sử dụng công nghệ nhận diện cảm xúc nâng
                  cao để giúp giáo viên hiểu được mức độ hứng thú và phản ứng
                  cảm xúc của học sinh trong lớp theo thời gian thực.
                </p>

                <h5 className="mt-4 mb-3 fw-bold" style={{ color: "#667eea" }}>
                  Các Tính Năng Chính
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div
                      className="p-3"
                      style={{
                        background: "#f8f9fa",
                        borderRadius: "10px",
                        borderLeft: "4px solid #667eea",
                      }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <i
                          className="fas fa-camera fa-2x"
                          style={{ color: "#667eea" }}
                        ></i>
                      </div>
                      <h6 className="fw-bold mb-1">Nhận Diện Thực Thời</h6>
                      <p className="text-muted small mb-0">
                        Phân tích biểu hiện khuôn mặt để xác định trạng thái cảm
                        xúc.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="p-3"
                      style={{
                        background: "#f8f9fa",
                        borderRadius: "10px",
                        borderLeft: "4px solid #764ba2",
                      }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <i
                          className="fas fa-chart-line fa-2x"
                          style={{ color: "#764ba2" }}
                        ></i>
                      </div>
                      <h6 className="fw-bold mb-1">Báo Cáo Chi Tiết</h6>
                      <p className="text-muted small mb-0">
                        Thống kê và biểu đồ cảm xúc toàn lớp theo thời gian.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="alert alert-info mt-4 mb-0"
                  style={{ borderRadius: "10px", border: "1px solid #d1ecf1" }}
                >
                  <i
                    className="fas fa-lock me-2"
                    style={{ color: "#0c5460" }}
                  ></i>
                  <strong>Thông Báo Bảo Mật:</strong> Tất cả dữ liệu được xử lý
                  cục bộ và không được chia sẻ với bên thứ ba.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
