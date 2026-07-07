"""Seed the database with initial content from content.json and default data.
Run with: python -m seed  (from the backend/ directory)"""
import json
import sys
from app.core.database import SessionLocal, engine, Base
from app.models import Admin, WebsiteSection, Service, PortfolioItem, Testimonial
from app.core.security import hash_password

Base.metadata.create_all(bind=engine)

SECTION_MAP = {
    "hero": {"title": "Hero", "order": 0},
    "about": {"title": "About", "order": 1},
    "services": {"title": "Services", "order": 2},
    "process": {"title": "Process", "order": 3},
    "faq": {"title": "FAQ", "order": 4},
    "contact": {"title": "Contact", "order": 5},
    "stats": {"title": "Statistics", "order": 6},
    "pricing": {"title": "Pricing", "order": 7},
}


def seed():
    db = SessionLocal()

    if db.query(Admin).first():
        print("Database already seeded.")
        db.close()
        return

    db.add(Admin(username="admin", hashed_password=hash_password("promotix123")))

    # Load from content.json if available
    try:
        with open("../content.json") as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = {}

    for key, meta in SECTION_MAP.items():
        content = data.get(key, {})
        if key == "services" and "services" in data:
            content = data["services"]
        section = WebsiteSection(
            key=key,
            title=meta["title"],
            content=content,
            is_visible=True,
            order=meta["order"],
        )
        db.add(section)

    # Seed services from content.json
    services_data = data.get("services", {})
    connect_items = services_data.get("connect", {}).get("items", [])
    for i, item in enumerate(connect_items):
        db.add(Service(section="connect", name=item.get("name", ""), description=item.get("desc", ""), icon="", order=i))

    properties_items = services_data.get("properties", {}).get("items", [])
    for i, item in enumerate(properties_items):
        db.add(Service(section="properties", name=item.get("name", ""), description=item.get("desc", ""), icon="", order=i))

    # Portfolio items
    portfolio_data = [
        {"title": "Royal Colony Campaign", "category": "social", "emoji": "🏗️", "subtitle": "Real Estate · Social Media", "order": 0},
        {"title": "Brand Reel Production", "category": "video", "emoji": "🎬", "subtitle": "Content Creation · Video", "order": 1},
        {"title": "Corporate Rebrand", "category": "branding", "emoji": "💼", "subtitle": "Branding · Identity", "order": 2},
        {"title": "Performance Campaign", "category": "social", "emoji": "📊", "subtitle": "Meta Ads · ROI Driven", "order": 3},
        {"title": "Premium Web Experience", "category": "video", "emoji": "🌐", "subtitle": "Motion Design · Development", "order": 4},
        {"title": "Luxury Brand Identity", "category": "branding", "emoji": "🎯", "subtitle": "Visual Identity · Strategy", "order": 5},
    ]
    for item in portfolio_data:
        db.add(PortfolioItem(**item))

    # Testimonials
    testimonial_data = [
        {"initials": "RK", "name": "Rajesh Kumar", "role": "Real Estate Developer, Nipani", "content": "Promotix transformed our brand presence. The reels went viral and brought us 3× more inquiries.", "order": 0},
        {"initials": "PM", "name": "Priya Mehta", "role": "CEO, Fashion Brand", "content": "The most professional agency we've ever worked with. Their strategic thinking exceeded every expectation.", "order": 1},
        {"initials": "AS", "name": "Amit Shah", "role": "Restaurant Owner, Belagavi", "content": "From branding to social media, Promotix handled everything with expertise. Our online presence grew 10×.", "order": 2},
        {"initials": "NK", "name": "Neha Kulkarni", "role": "E-commerce Founder", "content": "The AI automation Promotix built for us saves 20+ hours per week and dramatically improved lead quality.", "order": 3},
        {"initials": "VD", "name": "Vikram Desai", "role": "Fitness Brand Owner", "content": "Instagram following grew from 2K to 50K in just six months. Promotix's content strategy is unmatched.", "order": 4},
    ]
    for t in testimonial_data:
        db.add(Testimonial(**t))

    db.commit()
    db.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    seed()
