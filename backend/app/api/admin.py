from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models import Admin, WebsiteSection, Service, PortfolioItem, Testimonial, ContactMessage
from app.schemas import (
    WebsiteSectionOut, WebsiteSectionUpdate,
    ServiceOut, ServiceCreate, ServiceUpdate,
    PortfolioOut, PortfolioCreate, PortfolioUpdate,
    TestimonialOut, TestimonialCreate, TestimonialUpdate,
    ContactOut,
)

router = APIRouter()


# ─── Sections ──────────────────────────────────────────────

@router.get("/sections", response_model=list[WebsiteSectionOut])
def list_sections(admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    sections = db.query(WebsiteSection).order_by(WebsiteSection.order).all()
    return [WebsiteSectionOut.model_validate(s) for s in sections]


@router.put("/sections/{section_id}", response_model=WebsiteSectionOut)
def update_section(section_id: int, body: WebsiteSectionUpdate, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    section = db.query(WebsiteSection).filter(WebsiteSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    if body.title is not None:
        section.title = body.title
    if body.content is not None:
        section.content = body.content
    if body.is_visible is not None:
        section.is_visible = body.is_visible
    if body.order is not None:
        section.order = body.order
    section.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(section)
    return WebsiteSectionOut.model_validate(section)


# ─── Services ──────────────────────────────────────────────

@router.get("/services", response_model=list[ServiceOut])
def list_services(admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    services = db.query(Service).order_by(Service.section, Service.order).all()
    return [ServiceOut.model_validate(s) for s in services]


@router.post("/services", response_model=ServiceOut)
def create_service(body: ServiceCreate, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    max_order = db.query(Service.order).filter(Service.section == body.section).order_by(Service.order.desc()).first()
    service = Service(
        section=body.section,
        name=body.name,
        description=body.description,
        icon=body.icon or "",
        order=body.order or ((max_order[0] + 1) if max_order else 0),
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return ServiceOut.model_validate(service)


@router.put("/services/{service_id}", response_model=ServiceOut)
def update_service(service_id: int, body: ServiceUpdate, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    for field in ["section", "name", "description", "icon", "order", "is_visible"]:
        val = getattr(body, field, None)
        if val is not None:
            setattr(service, field, val)
    db.commit()
    db.refresh(service)
    return ServiceOut.model_validate(service)


@router.delete("/services/{service_id}")
def delete_service(service_id: int, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return {"ok": True}


# ─── Portfolio ─────────────────────────────────────────────

@router.get("/portfolio", response_model=list[PortfolioOut])
def list_portfolio(admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    items = db.query(PortfolioItem).order_by(PortfolioItem.order).all()
    return [PortfolioOut.model_validate(i) for i in items]


@router.post("/portfolio", response_model=PortfolioOut)
def create_portfolio(body: PortfolioCreate, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    max_order = db.query(PortfolioItem.order).order_by(PortfolioItem.order.desc()).first()
    item = PortfolioItem(
        title=body.title,
        category=body.category,
        emoji=body.emoji or "",
        subtitle=body.subtitle or "",
        gradient=body.gradient or "",
        order=body.order or ((max_order[0] + 1) if max_order else 0),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return PortfolioOut.model_validate(item)


@router.put("/portfolio/{item_id}", response_model=PortfolioOut)
def update_portfolio(item_id: int, body: PortfolioUpdate, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    item = db.query(PortfolioItem).filter(PortfolioItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    for field in ["title", "category", "emoji", "subtitle", "gradient", "order", "is_visible"]:
        val = getattr(body, field, None)
        if val is not None:
            setattr(item, field, val)
    db.commit()
    db.refresh(item)
    return PortfolioOut.model_validate(item)


@router.delete("/portfolio/{item_id}")
def delete_portfolio(item_id: int, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    item = db.query(PortfolioItem).filter(PortfolioItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")
    db.delete(item)
    db.commit()
    return {"ok": True}


# ─── Testimonials ──────────────────────────────────────────

@router.get("/testimonials", response_model=list[TestimonialOut])
def list_testimonials(admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    items = db.query(Testimonial).order_by(Testimonial.order).all()
    return [TestimonialOut.model_validate(i) for i in items]


@router.post("/testimonials", response_model=TestimonialOut)
def create_testimonial(body: TestimonialCreate, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    max_order = db.query(Testimonial.order).order_by(Testimonial.order.desc()).first()
    t = Testimonial(
        initials=body.initials,
        name=body.name,
        role=body.role,
        content=body.content,
        rating=body.rating,
        order=body.order or ((max_order[0] + 1) if max_order else 0),
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return TestimonialOut.model_validate(t)


@router.put("/testimonials/{testimonial_id}", response_model=TestimonialOut)
def update_testimonial(testimonial_id: int, body: TestimonialUpdate, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for field in ["initials", "name", "role", "content", "rating", "order", "is_visible"]:
        val = getattr(body, field, None)
        if val is not None:
            setattr(t, field, val)
    db.commit()
    db.refresh(t)
    return TestimonialOut.model_validate(t)


@router.delete("/testimonials/{testimonial_id}")
def delete_testimonial(testimonial_id: int, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(t)
    db.commit()
    return {"ok": True}


# ─── Messages ──────────────────────────────────────────────

@router.get("/messages", response_model=list[ContactOut])
def list_messages(admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    msgs = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [ContactOut.model_validate(m) for m in msgs]


@router.post("/messages/{message_id}/read")
def mark_read(message_id: int, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    return {"ok": True}


@router.delete("/messages/{message_id}")
def delete_message(message_id: int, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"ok": True}
