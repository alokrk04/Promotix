from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import WebsiteSection, Service, PortfolioItem, Testimonial, ContactMessage, Brand
from app.schemas import (
    WebsiteSectionOut, ServiceOut, PortfolioOut, TestimonialOut,
    ContactCreate, ContactOut, PublicWebsiteData, BrandOut,
)

router = APIRouter()


@router.get("/api/public/website", response_model=PublicWebsiteData)
def get_public_website(db: Session = Depends(get_db)):
    sections = db.query(WebsiteSection).filter(WebsiteSection.is_visible == True).order_by(WebsiteSection.order).all()
    services = db.query(Service).filter(Service.is_visible == True).order_by(Service.order).all()
    portfolio = db.query(PortfolioItem).filter(PortfolioItem.is_visible == True).order_by(PortfolioItem.order).all()
    testimonials = db.query(Testimonial).filter(Testimonial.is_visible == True).order_by(Testimonial.order).all()
    brands = db.query(Brand).filter(Brand.is_visible == True).order_by(Brand.order).all()
    
    # Get WebsiteSection 'brands' content (editable via admin 'Sections' tab)
    section = db.query(WebsiteSection).filter(WebsiteSection.key == 'brands').first()
    section_brands = []
    if section and isinstance(section.content, list):
        section_brands = section.content
    
    # Get Brand model brands visible
    brand_model_brands = db.query(Brand).filter(Brand.is_visible == True).order_by(Brand.order).all()
    
    # Build combined brands list: WebsiteSection content first, then Brand model brands not already included
    seen_names = set()
    combined_brands = []
    
    # Add WebsiteSection brands first (these are the ones editable via admin 'Sections' tab)
    for b in section_brands:
        name = b.get('name', '')
        if name:
            combined_brands.append(BrandOut(id=0, name=name, description=b.get('description', ''), is_visible=True, order=0))
    
    # Add Brand model brands not already included
    for b in brand_model_brands:
        if b.name not in seen_names:
            combined_brands.append(BrandOut(id=b.id, name=b.name, description=b.description or '', is_visible=b.is_visible, order=b.order))

    return PublicWebsiteData(
        sections=[WebsiteSectionOut.model_validate(s) for s in sections],
        services=[ServiceOut.model_validate(s) for s in services],
        portfolio=[PortfolioOut.model_validate(p) for p in portfolio],
        testimonials=[TestimonialOut.model_validate(t) for t in testimonials],
        brands=combined_brands,
    )


@router.post("/api/contact")
def submit_contact(body: ContactCreate, db: Session = Depends(get_db)):
    msg = ContactMessage(
        name=body.name,
        email=body.email or "",
        mobile=body.mobile or "",
        company=body.company or "",
        location=body.location or "",
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
                "heading": content.get("heading", "Promotix Connect"),
                "subheading": content.get("subheading", "Marketing Agency"),
                "subtitle": content.get("subtitle", ""),
                "connect": {
                    "heading": content.get("connect", {}).get("heading", "Promotix — Marketing Agency"),
                    "items": [{"name": svc.name, "desc": svc.description} for svc in connect],
                },
                "properties": {
                    "heading": content.get("properties", {}).get("heading", "Promotix — Marketing Agency"),
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
