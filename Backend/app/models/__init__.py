from sqlalchemy import Column, BigInteger, Text, TIMESTAMP, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from app.database.connect_db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    role = Column(Text, nullable=False)  # 'teacher', 'admin', 'principal'


class Class(Base):
    __tablename__ = "classes"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    teacher_id = Column(BigInteger, ForeignKey("users.id"), nullable=True)


class Session(Base):
    __tablename__ = "sessions"

    id = Column(BigInteger, primary_key=True, index=True)
    class_id = Column(BigInteger, ForeignKey("classes.id"))
    teacher_id = Column(BigInteger, ForeignKey("users.id"))
    start_time = Column(TIMESTAMP, nullable=False)
    end_time = Column(TIMESTAMP)


class EmotionType(Base):
    __tablename__ = "emotion_types"

    id = Column(BigInteger, primary_key=True)
    name = Column(Text, nullable=False, unique=True)


class EmotionRecord(Base):
    __tablename__ = "emotion_records"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("sessions.id"))
    face_id = Column(Text, nullable=False)
    emotion_id = Column(BigInteger, ForeignKey("emotion_types.id"))
    confidence = Column(Float, nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False)


class ClassEmotionSnapshot(Base):
    __tablename__ = "class_emotion_snapshots"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("sessions.id"))
    timestamp = Column(TIMESTAMP, nullable=False)
    emotion_summary = Column(JSON, nullable=False)


class SessionAlert(Base):
    __tablename__ = "session_alerts"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("sessions.id"))
    timestamp = Column(TIMESTAMP, nullable=False)
    alert_type = Column(Text, nullable=False)


class Report(Base):
    __tablename__ = "reports"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(BigInteger, ForeignKey("sessions.id"))
    created_at = Column(TIMESTAMP)
    report_data = Column(JSON, nullable=False)
