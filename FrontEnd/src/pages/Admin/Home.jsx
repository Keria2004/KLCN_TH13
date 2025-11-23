import React from "react";
import "./home.css";

const classData = [
  {
    id: 1,
    name: "LỚP 10A1",
    fps: 12,
    img: "https://via.placeholder.com/350x200?text=Lop+10A1",
    status: [
      { type: "green", icon: "fa-user-check", label: "Điểm danh đầy đủ" },
      { type: "orange", icon: "fa-users", label: "Hoạt động nhóm" },
    ],
    students: 30,
    activity: "Thảo luận",
    subject: "Bài tập Toán",
  },
  {
    id: 2,
    name: "LỚP 10B1",
    fps: 15,
    img: "https://via.placeholder.com/350x200?text=Lop+10B1",
    status: [
      { type: "red", icon: "fa-user-times", label: "Vắng học sinh" },
      {
        type: "blue",
        icon: "fa-chalkboard-teacher",
        label: "Giảng dạy trực tiếp",
      },
    ],
    students: 25,
    activity: "Làm bài cá nhân",
    subject: "Bài tập Văn",
  },
  {
    id: 3,
    name: "LỚP 11A1",
    fps: 10,
    img: "https://via.placeholder.com/350x200?text=Lop+11A1",
    status: [
      { type: "green", icon: "fa-user-check", label: "Điểm danh đầy đủ" },
      { type: "orange", icon: "fa-users", label: "Thảo luận nhóm" },
    ],
    students: 28,
    activity: "Thuyết trình",
    subject: "Bài tập Lý",
  },
];

export default function Home() {
  return (
    <div className="home-container">
      <h2 className="home-title">🎥 Giám Sát Trực Tiếp Các Lớp Học</h2>

      <div className="class-grid">
        {classData.map((cls) => (
          <div key={cls.id} className="class-card">
            {/* VIDEO / CAMERA */}
            <div className="video-box">
              <img src={cls.img} alt={cls.name} />
              <span className="fps-badge">FPS: {cls.fps}</span>
            </div>

            {/* INFO */}
            <div className="class-info">
              <h3>{cls.name}</h3>

              <div className="status-list">
                {cls.status.map((st, index) => (
                  <span className={`tag tag-${st.type}`} key={index}>
                    <i className={`fas ${st.icon}`}></i> {st.label}
                  </span>
                ))}
              </div>

              <div className="details">
                <div>
                  <label>Học sinh:</label>
                  <p>{cls.students}</p>
                </div>
                <div>
                  <label>Hoạt động:</label>
                  <p>{cls.activity}</p>
                </div>
                <div>
                  <label>Nội dung:</label>
                  <p>{cls.subject}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
