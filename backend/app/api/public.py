from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import WebsiteSection, Service, PortfolioItem, Testimonial, ContactMessage
from app.schemas import (
    WebsiteSectionOut, ServiceOut, PortfolioOut, TestimonialOut,
    ContactCreate, ContactOut, PublicWebsiteData,
)

router = APIRouter()


@router.get("/api/public/website", response_model=PublicWebsiteData)
def get_public_website(db: Session = Depends(get_db)):
    sections = db.query(WebsiteSection).filter(WebsiteSection.is_visible == True).order_by(WebsiteSection.order).all()
    services = db.query(Service).filter(Service.is_visible == True).order_by(Service.order).all()
    portfolio = db.query(PortfolioItem).filter(PortfolioItem.is_visible == True).order_by(PortfolioItem.order).all()
    testimonials = db.query(Testimonial).filter(Testimonial.is_visible == True).order_by(Testimonial.order).all()
    return PublicWebsiteData(
        sections=[WebsiteSectionOut.model_validate(s) for s in sections],
        services=[ServiceOut.model_validate(s) for s in services],
        portfolio=[PortfolioOut.model_validate(p) for p in portfolio],
        testimonials=[TestimonialOut.model_validate(t) for t in testimonials],
    )


@router.post("/api/contact")
def submit_contact(body: ContactCreate, db: Session = Depends(get_db)):
    msg = ContactMessage(
        name=body.name,
        email=body.email,
        company=body.company or "",
        service=body.service or "",
        message=body.message,
    )
    db.add(msg)
    db.commit()
    return {"ok": True}


@router.get("/api/content")
def get_content_json(db: Session = Depends(get_db)):
    sections = db.query(WebsiteSection).order_by(WebsiteSection.order).all()
    result = {}
    for s in sections:
        if s.key == "services":
            connect = db.query(Service).filter(Service.section == "connect").order_by(Service.order).all()
            properties = db.query(Service).filter(Service.section == "properties").order_by(Service.order).all()
            content = s.content if isinstance(s.content, dict) else {}
            result["services"] = {
                "heading": content.get("heading", "Two Brands, One Promise"),
                "subtitle": content.get("subtitle", ""),
                "connect": {
                    "heading": content.get("connect", {}).get("heading", "Promotix Connect — Marketing Agency"),
                    "items": [{"name": svc.name, "desc": svc.description} for svc in connect],
                },
                "properties": {
                    "heading": content.get("properties", {}).get("heading", "Promotix Properties — Real Estate Solutions"),
                    "items": [{"name": svc.name, "desc": svc.description} for svc in properties],
                },
            }
        elif s.key == "faq":
            result["faq"] = s.content if isinstance(s.content, list) else []
        elif isinstance(s.content, dict):
            result[s.key] = s.content
        else:
            result[s.key] = s.content
    return result
