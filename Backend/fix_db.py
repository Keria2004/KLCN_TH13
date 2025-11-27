"""
Fix database foreign key issue
Drop the foreign key constraint from sessions table
"""

from sqlalchemy import text
from app.database.db import engine

def fix_sessions_table():
    """Drop foreign key constraint if exists"""
    with engine.connect() as conn:
        try:
            # Drop foreign key constraint
            sql = """
            ALTER TABLE sessions 
            DROP CONSTRAINT IF EXISTS sessions_teacher_id_fkey;
            """
            conn.execute(text(sql))
            conn.commit()
            print("✅ Foreign key constraint removed")
        except Exception as e:
            print(f"⚠️ Error: {e}")
            conn.rollback()

if __name__ == "__main__":
    fix_sessions_table()
