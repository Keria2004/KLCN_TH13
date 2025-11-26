import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc ["*"] tạm thời
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from app.routers import (
    user_router,
    session_router,
    reading_router,
    note_router,
    report_router,
    monitoring_router,
    login_router
)

app.include_router(user_router.router)
app.include_router(session_router.router)
app.include_router(reading_router.router)
app.include_router(note_router.router)
app.include_router(report_router.router)
app.include_router(monitoring_router.router)
app.include_router(login_router.router)
