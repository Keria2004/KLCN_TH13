import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import MonitorPage from "./pages/MonitorPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LoginPage from "./pages/LoginPage";

// Hàm kiểm tra login
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// Component bảo vệ route
function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <div className="bg-light min-vh-100 d-flex flex-column">
        {/* HIỆN NAVBAR CHỈ KHI ĐÃ LOGIN */}
        {isLoggedIn() && (
          <header className="bg-white border-bottom">
            <nav className="navbar navbar-expand-lg navbar-light container">
              <NavLink className="navbar-brand fw-bold text-primary" to="/">
                Smart Classroom
              </NavLink>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNavbar"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="mainNavbar">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/">
                      Trang Chủ
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/monitor">
                      Giám sát
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/analytics">
                      Phân tích
                    </NavLink>
                  </li>

                  {/* Logout button */}
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-danger ms-3"
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                      }}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Đăng Xuất
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
        )}

        {/* MAIN CONTENT */}
        <main className="container flex-grow-1 py-4">
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitor"
              element={
                <ProtectedRoute>
                  <MonitorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        {isLoggedIn() && (
          <footer className="bg-white border-top py-3 mt-4">
            <div className="container text-center text-muted small">
              Lớp Học Thông Minh &copy; {new Date().getFullYear()}
            </div>
          </footer>
        )}
      </div>
    </Router>
  );
}
