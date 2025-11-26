from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# ============================
# Load environment variables
# ============================
load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# ============================
# Validate ENV (bắt buộc)
# ============================
missing_vars = [k for k, v in {
    "DB_USER": DB_USER,
    "DB_PASS": DB_PASS,
    "DB_NAME": DB_NAME
}.items() if v is None]

if missing_vars:
    raise ValueError(f"Missing environment variables: {', '.join(missing_vars)}")

# ============================
# Build Database URL
# ============================
DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# ============================
# Create Engine
# ============================
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # tự kiểm tra kết nối trước mỗi request → ổn định hơn
    echo=False            # bật True nếu muốn debug SQL
)

# ============================
# Create Session Factory
# ============================
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

# ============================
# Base class for all models
# ============================
Base = declarative_base()

# ============================
# Dependency for FastAPI
# ============================
def get_db():
    """
    Dependency injection cho FastAPI
    Tạo session mới cho mỗi request và tự đóng lại.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
