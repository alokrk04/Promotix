from fastapi import APIRouter

api_router = APIRouter()

from app.api.auth import router as auth_router
from app.api.public import router as public_router
from app.api.admin import router as admin_router

api_router.include_router(auth_router, tags=["Auth"])
api_router.include_router(public_router, tags=["Public"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin"])
