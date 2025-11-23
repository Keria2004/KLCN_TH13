from fastapi import FastAPI

from app.router.user_router import router as user_router
from app.router.class_router import router as class_router
from app.router.session_router import router as session_router
from app.router.emotion_router import router as emotion_router
from app.router.snapshot_router import router as snapshot_router
from app.router.alert_router import router as alert_router
from app.router.report_router import router as report_router

app = FastAPI(title="Emotion Monitoring API")

# include routers
app.include_router(user_router)
app.include_router(class_router)
app.include_router(session_router)
app.include_router(emotion_router)
app.include_router(snapshot_router)
app.include_router(alert_router)
app.include_router(report_router)
