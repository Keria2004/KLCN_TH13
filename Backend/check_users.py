#!/usr/bin/env python3
"""
Check and create test users if needed
"""
import os
from dotenv import load_dotenv
import psycopg2

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
    
    # Check existing users
    print("\n📋 Checking existing users...")
    cursor.execute("SELECT id, full_name, email FROM users LIMIT 10;")
    users = cursor.fetchall()
    
    if users:
        print(f"✅ Found {len(users)} users:")
        for user in users:
            print(f"   - ID: {user[0]}, Name: {user[1]}, Email: {user[2]}")
    else:
        print("❌ No users found. Creating test users...")
        
        # Create test users
        test_users = [
            ("Teacher One", "teacher1@school.edu", "password123"),
            ("Teacher Two", "teacher2@school.edu", "password123"),
        ]
        
        for name, email, password in test_users:
            cursor.execute(
                """INSERT INTO users (full_name, email, password_hash, role)
                   VALUES (%s, %s, %s, %s)
                   RETURNING id;""",
                (name, email, password, "teacher")
            )
            user_id = cursor.fetchone()[0]
            print(f"   ✅ Created user: {name} (ID: {user_id})")
        
        conn.commit()
        print("✅ Test users created successfully!")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)
