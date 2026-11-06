import json
from pathlib import Path
from sqlalchemy import inspect, text
from app.core.database import SessionLocal, engine, Base
from app.models import Admin, WebsiteSection, Service, PortfolioItem, Testimonial, ContactMessage, Brand
from app.core.security import hash_password

SECTION_MAP = {
    "hero": {"title": "Hero", "order": 0},
    "about": {"title": "About", "order": 1},
    "services": {"title": "Services", "order": 2},
    "process": {"title": "Process", "order": 3},
    "faq": {"title": "FAQ", "order": 4},
    "contact": {"title": "Contact", "order": 5},
    "stats": {"title": "Statistics", "order": 6},
    "pricing": {"title": "Pricing", "order": 7},
    "brands": {"title": "Brands We Work With", "order": 8},
}

portfolio_data = [
    {"title": "Performance Campaign", "category": "social", "emoji": "", "subtitle": "Meta Ads \u00b7 ROI Driven", "order": 0},
    {"title": "Premium Web Experience", "category": "video", "emoji": "", "subtitle": "Motion Design \u00b7 Development", "order": 1},
    {"title": "Luxury Brand Identity", "category": "branding", "emoji": "", "subtitle": "Visual Identity \u00b7 Strategy", "order": 2},
]

testimonial_data = [
    {"initials": "RK", "name": "Rajesh Kumar", "role": "Real Estate Developer, Nipani", "content": "Promotix transformed our brand presence. The reels went viral and brought us 3x more inquiries.", "order": 0},
    {"initials": "PM", "name": "Priya Mehta", "role": "CEO, Fashion Brand", "content": "The most professional agency we've ever worked with. Their strategic thinking exceeded every expectation.", "order": 1},
    {"initials": "AS", "name": "Amit Shah", "role": "Restaurant Owner, Belagavi", "content": "From branding to social media, Promotix handled everything with expertise. Our online presence grew 10x.", "order": 2},
    {"initials": "NK", "name": "Neha Kulkarni", "role": "E-commerce Founder", "content": "The AI automation Promotix built for us saves 20+ hours per week and dramatically improved lead quality.", "order": 3},
    {"initials": "VD", "name": "Vikram Desai", "role": "Fitness Brand Owner", "content": "Instagram following grew from 2K to 50K in just six months. Promotix's content strategy is unmatched.", "order": 4},
]


def load_content_data(backend_dir: Path) -> dict:
    for path in [backend_dir.parent / "content.json", backend_dir / "content.json"]:
        try:
            with open(path) as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            continue
    return {}


def migrate_schema():
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    with engine.connect() as conn:
        if inspector.has_table("contact_messages"):
            columns = {c["name"] for c in inspector.get_columns("contact_messages")}
            if "mobile" not in columns:
                conn.execute(text("ALTER TABLE contact_messages ADD COLUMN mobile VARCHAR(255)"))
            if "email" in columns:
                try:
                    conn.execute(text("ALTER TABLE contact_messages ALTER COLUMN email DROP NOT NULL"))
                except Exception:
                    pass
            conn.commit()


def seed_database():
    migrate_schema()
    db = SessionLocal()

    if not db.query(Admin).first():
        db.add(Admin(username="admin", hashed_password=hash_password("promotix123")))

    data = load_content_data(Path(__file__).resolve().parent.parent)

    existing_keys = {key for (key,) in db.query(WebsiteSection.key).all()}
    for key, meta in SECTION_MAP.items():
        if key in existing_keys:
            continue
        json_content = data.get(key, {})
        if key == "services" and "services" in data:
            json_content = data["services"]
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

    # Seed default brands if none exist
    brand_names = {b.name for b in db.query(Brand).all()}
    default_brands = [
        {"name": "Pooja Dining", "description": "Restaurant & dining brand — social media, reels and menu promotions that bring more covers through the door.", "order": 0, "is_visible": True},
        {"name": "Shree Shyam Gulacha Chaha", "description": "Local chai brand — identity, packaging and social reach that turned a corner stall into a community favourite.", "order": 1, "is_visible": True},
        {"name": "Creative Enterprises", "description": "Wholesale decorators for events — branding and digital presence built to look credible and win bookings.", "order": 2, "is_visible": True},
        {"name": "Jay Jagganath Hospital", "description": "Healthcare brand — awareness campaigns and reputation building that earn patient trust.", "order": 3, "is_visible": True},
        {"name": "Mangal Alankar", "description": "Jewellery brand — cinematic product videos and festive campaigns that drive footfall.", "order": 4, "is_visible": True},
        {"name": "SD Cabinets", "description": "Cabinet manufacturers — product shoots and promotions that showcase precision craftsmanship and drive enquiries.", "order": 5, "is_visible": True},
        {"name": "Sai Mobiles Gallery", "description": "Retail mobile store — offers, reels and local ads that fill the sales floor.", "order": 6, "is_visible": True},
        {"name": "Denzfox", "description": "Clothing store — fashion shoots, reels and seasonal campaigns that drive footfall and online sales.", "order": 7, "is_visible": True},
        {"name": "Radhika Dining", "description": "Veg & non-veg restaurant — menu promotions, reels and local ads that fill the tables.", "order": 8, "is_visible": True},
    ]
    for i, bd in enumerate(default_brands):
        if bd["name"] not in brand_names:
            db.add(Brand(
                name=bd["name"],
                description=bd["description"],
                order=bd["order"],
                is_visible=bd["is_visible"],
            ))

    db.commit()
    db.close()


if __name__ == "__main__":
    seed_database()
