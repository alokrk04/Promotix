import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, PlainTextResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.config import settings
from app.core.database import engine, Base
from app.api import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Promotix API", docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def seed_default_admin():
    from app.core.database import SessionLocal
    from app.models import Admin
    from app.core.security import hash_password
    db = SessionLocal()
    if not db.query(Admin).first():
        db.add(Admin(username=settings.ADMIN_USERNAME, hashed_password=hash_password(settings.ADMIN_PASSWORD)))
        db.commit()
    db.close()


# ─── Static Files & SPA ─────────────────────────────────

if os.path.isdir("../frontend/dist/assets"):
    app.mount("/assets", StaticFiles(directory="../frontend/dist/assets"), name="assets")

if os.path.isdir("../resources"):
    app.mount("/resources", StaticFiles(directory="../resources"), name="resources")


@app.get("/")
async def index():
    spa_path = "../frontend/dist/index.html"
    if os.path.isfile(spa_path):
        return FileResponse(spa_path)
    html_path = "../frontend/promotix-website.html"
    if os.path.isfile(html_path):
        return FileResponse(html_path)
    return PlainTextResponse("Not Found", status_code=404)


@app.get("/promotix-website.html")
async def legacy_website():
    return FileResponse("../frontend/promotix-website.html")


@app.get("/admin.html")
async def legacy_admin():
    return FileResponse("../frontend/admin.html")


@app.get("/login.html")
async def legacy_login():
    return FileResponse("../frontend/login.html")


@app.exception_handler(StarletteHTTPException)
async def spa_fallback(request, exc):
    if exc.status_code == 404 and not request.url.path.startswith("/api/"):
        spa_path = "../frontend/dist/index.html"
        if os.path.isfile(spa_path):
            return FileResponse(spa_path, media_type="text/html")
    if request.url.path.startswith("/api/"):
        from fastapi.responses import JSONResponse
        return JSONResponse({"error": str(exc.detail)}, status_code=exc.status_code)
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)
