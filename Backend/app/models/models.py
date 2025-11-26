from sqlalchemy import (
    Column, BigInteger, String, Text, Float, Integer,
    DateTime, ForeignKey
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
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ===========================
#       SESSION (BUỔI HỌC)
# ===========================
class Session(Base):
    __tablename__ = "sessions"

    id = Column(BigInteger, primary_key=True)
    teacher_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"))
    subject = Column(String, nullable=False)
    status = Column(String, default="active")  # 'active' | 'closed'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Integer, nullable=True)  # Tổng thời gian buổi học (giây)
    total_frames = Column(Integer, default=0)  # Tổng frame phân tích
    emotion_summary = Column(Text, nullable=True)  # JSON: {emotion: count}

    teacher = relationship("User")
    readings = relationship("EmotionReading", cascade="all,delete")
    notes = relationship("SessionNotes", uselist=False, cascade="all,delete")


# ===========================
#       EMOTION READINGS
# ===========================
class EmotionReading(Base):
    __tablename__ = "emotion_readings"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("sessions.id", ondelete="CASCADE"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    emotion = Column(String, nullable=False)
    confidence = Column(Float)
    face_count = Column(Integer)
    image_path = Column(Text)

    session = relationship("Session")


# ===========================
#       SESSION NOTES
# ===========================
class SessionNotes(Base):
    __tablename__ = "session_notes"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("sessions.id", ondelete="CASCADE"))

    summary = Column(Text)
    notes = Column(Text)


# ===========================
#       SESSION REPORTS
# ===========================
class SessionReport(Base):
    __tablename__ = "session_reports"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("sessions.id", ondelete="CASCADE"))
    file_path = Column(Text, nullable=False)
    exported_by = Column(BigInteger, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
