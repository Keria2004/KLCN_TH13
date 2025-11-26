import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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
        setError(data.detail || "Login failed");
        return;
      }

      // Lưu token + user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("teacher_name", data.full_name);
      localStorage.setItem("teacher_id", data.id);
      localStorage.setItem("role", data.role);

      window.location.href = "/";
    } catch (err) {
      setError("Cannot connect to server");
    }
  };

  // ⭐ Quick Login: login nhanh không cần tài khoản
  const handleQuickLogin = () => {
    localStorage.setItem("token", "quick_token_123");
    localStorage.setItem("teacher_name", "Quick Teacher");
    localStorage.setItem("teacher_id", "0");
    localStorage.setItem("role", "teacher");

    window.location.href = "/";
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "380px" }}>
        <div className="text-center mb-4">
          <i className="fas fa-chalkboard-teacher fa-3x text-primary"></i>
          <h3 className="mt-2">Đăng Nhập</h3>
        </div>

        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Tên người dùng / Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                className="form-control"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập..."
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-2">
            <i className="fas fa-sign-in-alt me-2"></i>Đăng Nhập
          </button>

          {/* ⭐ Quick Login Button */}
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={handleQuickLogin}
          >
            <i className="fas fa-bolt me-2"></i>
            Quick Login (Không cần tài khoản)
          </button>

          <div className="text-center mt-3">
            <a href="#" className="small text-decoration-none">
              Quên mật khẩu?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
