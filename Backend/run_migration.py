import psycopg2
from psycopg2 import sql

# Database connection parameters
conn = psycopg2.connect(
    host="localhost",
    database="phantichcamxuc",
    user="postgres",
    password="sa123",
    port=5432
)

cursor = conn.cursor()

# Read and execute migration
with open(r"d:\KLCN_TH13-master\Backend\migrations\add_video_path_and_fix_timestamps.sql", "r") as f:
    migration_sql = f.read()

# Execute the migration
cursor.execute(migration_sql)
conn.commit()

print("✅ Migration executed successfully!")
cursor.close()
conn.close()
