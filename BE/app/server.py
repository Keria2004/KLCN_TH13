from fastapi import FastAPI
from app.api.class_api import router as class_router

app = FastAPI()

app.include_router(class_router)


