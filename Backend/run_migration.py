#!/usr/bin/env python3
"""
Run database migrations
"""
import os
from dotenv import load_dotenv
import psycopg2
from pathlib import Path

# Load environment
load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

print(f"🔌 Connecting to PostgreSQL: {DB_HOST}:{DB_PORT}/{DB_NAME}")

try:
    conn = psycopg2.connect(
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME
    )
    
    cursor = conn.cursor()
    
    # Read migration file
    migration_file = Path(__file__).parent / "migrations" / "add_session_fields.sql"
    
    if not migration_file.exists():
        print(f"❌ Migration file not found: {migration_file}")
        exit(1)
    
    with open(migration_file, 'r') as f:
        migration_sql = f.read()
    
    print("📝 Executing migration...")
    cursor.execute(migration_sql)
    conn.commit()
    
    print("✅ Migration completed successfully!")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)
