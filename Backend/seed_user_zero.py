"""
Script để tạo test user với id=0
Chạy: python seed_user_zero.py
"""
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import Base, User
from app.database.db import DATABASE_URL

# Create engine and session
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

def seed_user_zero():
    """Tạo user id=0 cho development"""
    
    try:
        # Kiểm tra nếu user id=0 đã tồn tại
        existing_user = session.query(User).filter(User.id == 0).first()
        if existing_user:
            print("✅ User id=0 đã tồn tại. Bỏ qua.")
            return
        
        # Tạo user id=0
        teacher_zero = User(
            id=0,
            full_name="Giáo viên Mẫu",
            email="teacher.zero@example.com",
            password_hash="hashed_password_123",
            role="teacher",
            is_active=True
        )
        
        session.add(teacher_zero)
        session.commit()
        print("✅ Seed user id=0 thành công!")
        print(f"   - ID 0: {teacher_zero.full_name} ({teacher_zero.role})")
        print("\n🎉 Bây giờ bạn có thể dùng Quick Login để test!")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Lỗi: {str(e)}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    seed_user_zero()
