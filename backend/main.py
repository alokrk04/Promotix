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


@app.get("/health")
async def health():
    return {"status": "ok"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?|.*\.netlify\.app|.*\.onrender\.com|.*\.pages\.dev|https?://(.*\.)?promotix\.in",
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

    data = load_content_data(BACKEND_DIR)

    existing = {s.key: s for s in db.query(WebsiteSection).all()}
    for key, meta in SECTION_MAP.items():
        json_content = data.get(key, {})
        if key == "services" and "services" in data:
            json_content = data["services"]
        if key in existing:
            existing[key].content = json_content
            existing[key].title = meta["title"]
            existing[key].is_visible = True
        else:
            db.add(WebsiteSection(key=key, title=meta["title"], content=json_content, is_visible=True, order=meta["order"]))

    services_data = data.get("services", {})
    connect_names = {s.name for s in db.query(Service).filter(Service.section == "connect").all()}
    for i, item in enumerate(services_data.get("connect", {}).get("items", [])):
        if item.get("name") not in connect_names:
            db.add(Service(section="connect", name=item.get("name", ""), description=item.get("desc", ""), icon="", order=i))

    properties_names = {s.name for s in db.query(Service).filter(Service.section == "properties").all()}
    for i, item in enumerate(services_data.get("properties", {}).get("items", [])):
        if item.get("name") not in properties_names:
            db.add(Service(section="properties", name=item.get("name", ""), description=item.get("desc", ""), icon="", order=i))

    json_portfolio = data.get("portfolio")
    if isinstance(json_portfolio, list):
        portfolio_titles = {p.title for p in db.query(PortfolioItem).all()}
        for i, item in enumerate(json_portfolio):
            if item.get("title") not in portfolio_titles:
                db.add(PortfolioItem(
                    title=item.get("title", ""),
                    category=item.get("category", "social"),
                    emoji=item.get("emoji", ""),
                    subtitle=item.get("subtitle", ""),
                    gradient=item.get("gradient", ""),
                    order=i,
                ))
    elif not db.query(PortfolioItem).first():
        for item in portfolio_data:
            db.add(PortfolioItem(**item))

    json_testimonials = data.get("testimonials")
    if isinstance(json_testimonials, list):
        testimonial_names = {t.name for t in db.query(Testimonial).all()}
        for i, item in enumerate(json_testimonials):
            if item.get("name") not in testimonial_names:
                db.add(Testimonial(
                    initials=item.get("initials", ""),
                    name=item.get("name", ""),
                    role=item.get("role", ""),
                    content=item.get("content", ""),
                    rating=item.get("rating", 5),
                    order=i,
                ))
    elif not db.query(Testimonial).first():
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
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload_excludes=["venv/**"])
