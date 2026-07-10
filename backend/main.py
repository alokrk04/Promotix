import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, PlainTextResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.config import settings
from app.core.database import engine, Base
from app.api import api_router

Base.metadata.create_all(bind=engine)

BACKEND_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BACKEND_DIR.parent / "frontend" / "dist"
RESOURCES_DIR = BACKEND_DIR.parent / "resources"

app = FastAPI(title="Promotix API", docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?|.*\.netlify\.app|https?://(.*\.)?promotix\.in",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def seed_database():
    from app.core.database import SessionLocal
    from app.models import Admin, WebsiteSection, Service, PortfolioItem, Testimonial
    from app.core.security import hash_password
    from app.services.seed import SECTION_MAP, portfolio_data, testimonial_data, load_content_data

    db = SessionLocal()

    if not db.query(Admin).first():
        db.add(Admin(username=settings.ADMIN_USERNAME, hashed_password=hash_password(settings.ADMIN_PASSWORD)))

    if not db.query(WebsiteSection).first():
        data = load_content_data(BACKEND_DIR)
        for key, meta in SECTION_MAP.items():
            content = data.get(key, {})
            if key == "services" and "services" in data:
                content = data["services"]
            db.add(WebsiteSection(key=key, title=meta["title"], content=content, is_visible=True, order=meta["order"]))

        services_data = data.get("services", {})
        for i, item in enumerate(services_data.get("connect", {}).get("items", [])):
            db.add(Service(section="connect", name=item.get("name", ""), description=item.get("desc", ""), icon="", order=i))
        for i, item in enumerate(services_data.get("properties", {}).get("items", [])):
            db.add(Service(section="properties", name=item.get("name", ""), description=item.get("desc", ""), icon="", order=i))

        for item in portfolio_data:
            db.add(PortfolioItem(**item))

        for t in testimonial_data:
            db.add(Testimonial(**t))

    db.commit()
    db.close()


# ─── Static Files & SPA ─────────────────────────────────

SPA_DIR = FRONTEND_DIST / "assets"
if SPA_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=str(SPA_DIR)), name="assets")

if RESOURCES_DIR.is_dir():
    app.mount("/resources", StaticFiles(directory=str(RESOURCES_DIR)), name="resources")


@app.get("/")
@app.head("/")
async def index():
    spa_path = FRONTEND_DIST / "index.html"
    if spa_path.is_file():
        return FileResponse(str(spa_path))
    html_path = FRONTEND_DIST.parent / "promotix-website.html"
    if html_path.is_file():
        return FileResponse(str(html_path))
    return PlainTextResponse("Not Found", status_code=404)


@app.get("/promotix-website.html")
async def legacy_website():
    return FileResponse(str(FRONTEND_DIST.parent / "promotix-website.html"))


@app.get("/admin.html")
async def legacy_admin():
    return FileResponse(str(FRONTEND_DIST.parent / "admin.html"))


@app.get("/login.html")
@app.get("/login")
async def legacy_login():
    return FileResponse(str(FRONTEND_DIST.parent / "login.html"))


@app.exception_handler(StarletteHTTPException)
async def spa_fallback(request, exc):
    path = request.url.path
    if exc.status_code == 404 and not path.startswith("/api/"):
        spa_path = FRONTEND_DIST / "index.html"
        if spa_path.is_file():
            return FileResponse(str(spa_path), media_type="text/html")
    if path.startswith("/api/"):
        from fastapi.responses import JSONResponse
        return JSONResponse({"error": str(exc.detail)}, status_code=exc.status_code)
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
