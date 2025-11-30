from sqlalchemy import (
    Column, BigInteger, String, Text, Float, Integer,
    DateTime, ForeignKey, Boolean, Index
)
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

# ===========================
#       USERS
# ===========================
class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=True, index=True)  # Username tùy chọn
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, index=True)  # teacher, admin, student
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationship → Sessions & Reports
    sessions = relationship("Session", back_populates="teacher", cascade="all,delete")
    session_reports = relationship("SessionReport", back_populates="exporter")


# ===========================
#       SESSION (BUỔI HỌC)
# ===========================
class Session(Base):
    __tablename__ = "sessions"
    __table_args__ = (
        Index("idx_sessions_teacher_id", "teacher_id"),
        Index("idx_sessions_status", "status"),
    )

    id = Column(BigInteger, primary_key=True)

    teacher_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject = Column(String, nullable=False)

    status = Column(String, default="active")  # active, ended
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)

    # Summary
    duration_seconds = Column(Integer, default=0)
    total_frames = Column(Integer, default=0)
    dominant_emotion = Column(String, nullable=True)
    positive_rate = Column(Float, default=0.0)
    emotion_summary = Column(Text, nullable=True)  # JSON string with emotion counts

    notes = Column(Text, nullable=True)

    # Relationships
    teacher = relationship("User", back_populates="sessions")
    emotion_readings = relationship("EmotionReading", cascade="all,delete", back_populates="session")
    session_reports = relationship("SessionReport", cascade="all,delete", back_populates="session")


# ===========================
#       EMOTION READINGS
# ===========================
class EmotionReading(Base):
    __tablename__ = "emotion_readings"
    __table_args__ = (
        Index("idx_er_session_id", "session_id"),
        Index("idx_er_frame", "session_id", "frame_number"),
    )

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)

    frame_number = Column(Integer, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    time_offset_seconds = Column(Float, nullable=True)

    emotion = Column(String, nullable=False)
    confidence = Column(Float, nullable=True)

    face_count = Column(Integer, default=0)

    image_path = Column(Text, nullable=True)

    # Relationship
    session = relationship("Session", back_populates="emotion_readings")


# ===========================
#       SESSION REPORTS
# ===========================
class SessionReport(Base):
    __tablename__ = "session_reports"
    __table_args__ = (
        Index("idx_session_reports_session_id", "session_id"),
        Index("idx_session_reports_exported_at", "exported_at"),
    )

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("sessions.id", ondelete="CASCADE"))

    report_format = Column(String, nullable=False)  # PDF, CSV, JSON, EXCEL
    file_path = Column(Text, nullable=False)
    file_size_bytes = Column(Integer, nullable=True)

    exported_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    exported_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    session = relationship("Session", back_populates="session_reports")
    exporter = relationship("User", back_populates="session_reports")
