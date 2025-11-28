import { useState } from "react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("teacher");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Đăng nhập thất bại");
        return;
      }

      // Lưu token + user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("teacher_name", data.full_name);
      localStorage.setItem("teacher_id", data.id);
      localStorage.setItem("role", data.role);

      window.location.href = "/";
    } catch (err) {
      setError("Không thể kết nối đến máy chủ");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!email.includes("@")) {
      setError("Email không hợp lệ");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Đăng kí thất bại");
        return;
      }

      setSuccess("✅ Đăng kí thành công! Vui lòng đăng nhập.");
      setTimeout(() => {
        setActiveTab("login");
        setUsername(email);
        setPassword("");
        setEmail("");
        setFullName("");
      }, 1500);
    } catch (err) {
      setError("Không thể kết nối đến máy chủ");
    }
  };

  // ⭐ Quick Login: login nhanh không cần tài khoản
  const handleQuickLogin = () => {
    localStorage.setItem("token", "quick_token_123");
    localStorage.setItem("teacher_name", "Giáo viên Mẫu");
    localStorage.setItem("teacher_id", "0");
    localStorage.setItem("role", "teacher");

    window.location.href = "/";
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div
              className="card shadow-lg border-0"
              style={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <div
                className="text-center text-white p-5"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <i
                  className="fas fa-chalkboard-teacher fa-4x mb-3"
                  style={{ opacity: 0.9 }}
                ></i>
                <h2 className="fw-bold mb-1">Lớp Học Thông Minh</h2>
                <p className="mb-0 small" style={{ opacity: 0.9 }}>
                  Nhận diện cảm xúc trong lớp học
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="border-bottom" style={{ background: "#f8f9fa" }}>
                <ul
                  className="nav nav-pills nav-fill gap-2 p-3 mb-0"
                  role="tablist"
                  style={{ borderBottom: "none" }}
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link w-100 fw-bold py-2 ${
                        activeTab === "login" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("login")}
                      type="button"
                      role="tab"
                      style={{
                        borderRadius: "8px",
                        color: activeTab === "login" ? "white" : "#667eea",
                        background:
                          activeTab === "login"
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "transparent",
                        border: "none",
                        transition: "all 0.3s",
                      }}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>Đăng Nhập
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link w-100 fw-bold py-2 ${
                        activeTab === "register" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("register")}
                      type="button"
                      role="tab"
                      style={{
                        borderRadius: "8px",
                        color: activeTab === "register" ? "white" : "#667eea",
                        background:
                          activeTab === "register"
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "transparent",
                        border: "none",
                        transition: "all 0.3s",
                      }}
                    >
                      <i className="fas fa-user-plus me-2"></i>Đăng Kí
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body p-5">
                {/* Error Alert */}
                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show d-flex align-items-start"
                    role="alert"
                    style={{ borderRadius: "8px", border: "1px solid #f5c6cb" }}
                  >
                    <i
                      className="fas fa-exclamation-circle me-3 mt-1"
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

                {/* Success Alert */}
                {success && (
                  <div
                    className="alert alert-success alert-dismissible fade show d-flex align-items-start"
                    role="alert"
                    style={{ borderRadius: "8px", border: "1px solid #c3e6cb" }}
                  >
                    <i
                      className="fas fa-check-circle me-3 mt-1"
                      style={{ color: "#155724" }}
                    ></i>
                    <div className="flex-grow-1">{success}</div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSuccess("")}
                    ></button>
                  </div>
                )}

                {/* LOGIN TAB */}
                {activeTab === "login" && (
                  <form onSubmit={handleLogin}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Tên người dùng / Email
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
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Nhập tên đăng nhập..."
                          style={{ background: "#f8f9fa" }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Mật khẩu
                      </label>
                      <div
                        className="input-group"
                        style={{ borderRadius: "8px", overflow: "hidden" }}
                      >
                        <span
                          className="input-group-text bg-light border-0"
                          style={{ color: "#667eea" }}
                        >
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control border-0"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Nhập mật khẩu..."
                          style={{ background: "#f8f9fa" }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn w-100 mb-3 fw-bold py-2"
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>Đăng Nhập
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-primary w-100 mb-3 fw-bold py-2"
                      onClick={handleQuickLogin}
                      style={{
                        borderColor: "#667eea",
                        color: "#667eea",
                        borderRadius: "8px",
                      }}
                    >
                      <i className="fas fa-bolt me-2"></i>
                      Đăng Nhập Nhanh
                    </button>

                    <div className="text-center pt-2">
                      <a
                        href="#"
                        className="small text-decoration-none"
                        style={{ color: "#667eea" }}
                      >
                        <i className="fas fa-lock me-1"></i>Quên mật khẩu?
                      </a>
                    </div>
                  </form>
                )}

                {/* REGISTER TAB */}
                {activeTab === "register" && (
                  <form onSubmit={handleRegister}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Họ và Tên
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
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nhập họ và tên..."
                          style={{ background: "#f8f9fa" }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Email
                      </label>
                      <div
                        className="input-group"
                        style={{ borderRadius: "8px", overflow: "hidden" }}
                      >
                        <span
                          className="input-group-text bg-light border-0"
                          style={{ color: "#667eea" }}
                        >
                          <i className="fas fa-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-0"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Nhập email..."
                          style={{ background: "#f8f9fa" }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Mật khẩu
                      </label>
                      <div
                        className="input-group"
                        style={{ borderRadius: "8px", overflow: "hidden" }}
                      >
                        <span
                          className="input-group-text bg-light border-0"
                          style={{ color: "#667eea" }}
                        >
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control border-0"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Tối thiểu 6 ký tự..."
                          minLength="6"
                          style={{ background: "#f8f9fa" }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Vai Trò
                      </label>
                      <select
                        className="form-select border-0"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                          background: "#f8f9fa",
                          borderRadius: "8px",
                          color: "#667eea",
                        }}
                      >
                        <option value="teacher">Giáo Viên</option>
                        <option value="admin">Quản Trị Viên</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn w-100 mb-3 fw-bold py-2"
                      style={{
                        background:
                          "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    >
                      <i className="fas fa-user-plus me-2"></i>Đăng Kí
                    </button>

                    <p className="text-center text-muted small mb-0">
                      Bằng cách đăng kí, bạn đồng ý với{" "}
                      <a
                        href="#"
                        className="text-decoration-none"
                        style={{ color: "#667eea" }}
                      >
                        Điều khoản sử dụng
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
