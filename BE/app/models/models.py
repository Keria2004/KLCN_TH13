from sqlalchemy import Column, BigInteger, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.connect_db import Base

class Class(Base):
    __tablename__ = "classes"

    id = Column(BigInteger, primary_key=True)
    name = Column(Text, nullable=False)
    teacher_id = Column(BigInteger, ForeignKey("users.id"))

    sessions = relationship("Session", back_populates="class_ref")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(BigInteger, primary_key=True)
    class_id = Column(BigInteger, ForeignKey("classes.id"))
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True))

    class_ref = relationship("Class", back_populates="sessions")
