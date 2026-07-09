import secrets
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models import Admin, WebsiteSection, Service, ContactMessage
from app.core.security import verify_password, get_admin_from_jwt

router = APIRouter()

SESSION_COOKIE = "admin_session"
active_sessions: dict[str, str] = {}

SECTION_KEYS = {"hero", "about", "services", "process", "faq", "contact", "stats", "pricing"}


class LoginBody(BaseModel):
    username: str
    password: str


def get_admin_from_session(admin_session: Optional[str], db: Session) -> Optional[Admin]:
    if not admin_session or admin_session not in active_sessions:
        return None
    username = active_sessions[admin_session]
    return db.query(Admin).filter(Admin.username == username).first()


def get_admin_mixed(request: Request, admin_session: Optional[str], db: Session) -> Optional[Admin]:
    admin = get_admin_from_session(admin_session, db)
    if admin is None:
        admin = get_admin_from_jwt(request, db)
    return admin


@router.post("/api/compat/login")
def compat_login(body: LoginBody, response: Response, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == body.username).first()
    if not admin or not verify_password(body.password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = secrets.token_hex(32)
    active_sessions[token] = admin.username
    response.set_cookie(key=SESSION_COOKIE, value=token, httponly=True, samesite="lax")
    return {"ok": True}


@router.get("/api/check-auth")
def compat_check_auth(
    request: Request,
    admin_session: Optional[str] = Cookie(None),
    db: Session = Depends(get_db),
):
    admin = get_admin_mixed(request, admin_session, db)
    return {"isAdmin": admin is not None}


@router.post("/api/logout")
def compat_logout(response: Response, admin_session: Optional[str] = Cookie(None)):
    if admin_session and admin_session in active_sessions:
        del active_sessions[admin_session]
    response.delete_cookie(key=SESSION_COOKIE)
    return {"ok": True}


@router.post("/api/content")
def compat_save_content(
    request: Request,
    body: dict,
    admin_session: Optional[str] = Cookie(None),
    db: Session = Depends(get_db),
):
    admin = get_admin_mixed(request, admin_session, db)
    if not admin:
        raise HTTPException(status_code=401, detail="Not authenticated")

    for key, value in body.items():
        if key not in SECTION_KEYS:
            continue

        section = db.query(WebsiteSection).filter(WebsiteSection.key == key).first()
        if not section:
            continue

        if key == "services":
            section.content = {
                "heading": value.get("heading", ""),
                "subtitle": value.get("subtitle", ""),
                "connect": {
                    "heading": value.get("connect", {}).get("heading", ""),
                    "items": value.get("connect", {}).get("items", []),
                },
                "properties": {
                    "heading": value.get("properties", {}).get("heading", ""),
                    "items": value.get("properties", {}).get("items", []),
                },
            }
        elif key == "faq":
            section.content = value if isinstance(value, list) else []
        elif isinstance(value, dict):
            section.content = value
        else:
            section.content = value

        section.updated_at = datetime.now(timezone.utc)

    if "services" in body:
        svc_data = body["services"]
        db.query(Service).filter(Service.section == "connect").delete()
        for i, item in enumerate(svc_data.get("connect", {}).get("items", [])):
            db.add(Service(
                section="connect",
                name=item.get("name", ""),
                description=item.get("desc", ""),
                icon="",
                order=i,
            ))
        db.query(Service).filter(Service.section == "properties").delete()
        for i, item in enumerate(svc_data.get("properties", {}).get("items", [])):
            db.add(Service(
                section="properties",
                name=item.get("name", ""),
                description=item.get("desc", ""),
                icon="",
                order=i,
            ))

    db.commit()
    return {"ok": True}


@router.get("/api/messages")
def compat_list_messages(
    request: Request,
    admin_session: Optional[str] = Cookie(None),
    db: Session = Depends(get_db),
):
    admin = get_admin_mixed(request, admin_session, db)
    if not admin:
        raise HTTPException(status_code=401, detail="Not authenticated")
    msgs = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "company": m.company or "",
            "location": m.location or "",
            "service": m.service or "",
            "message": m.message,
            "read": m.is_read,
            "date": m.created_at.isoformat() if m.created_at else "",
        }
        for m in msgs
    ]


@router.post("/api/messages/read/{message_id}")
def compat_mark_read(
    request: Request,
    message_id: int,
    admin_session: Optional[str] = Cookie(None),
    db: Session = Depends(get_db),
):
    admin = get_admin_mixed(request, admin_session, db)
    if not admin:
        raise HTTPException(status_code=401, detail="Not authenticated")
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    return {"ok": True}


@router.post("/api/messages/delete/{message_id}")
def compat_delete_message(
    request: Request,
    message_id: int,
    admin_session: Optional[str] = Cookie(None),
    db: Session = Depends(get_db),
):
    admin = get_admin_mixed(request, admin_session, db)
    if not admin:
        raise HTTPException(status_code=401, detail="Not authenticated")
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"ok": True}
