from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class WebsiteSectionOut(BaseModel):
    id: int
    key: str
    title: Optional[str] = None
    content: Any
    is_visible: bool
    order: int
    updated_at: datetime

    class Config:
        from_attributes = True


class WebsiteSectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[Any] = None
    is_visible: Optional[bool] = None
    order: Optional[int] = None


class ServiceOut(BaseModel):
    id: int
    section: str
    name: str
    description: str
    icon: Optional[str] = None
    order: int
    is_visible: bool

    class Config:
        from_attributes = True


class ServiceCreate(BaseModel):
    section: str
    name: str
    description: str
    icon: Optional[str] = None
    order: Optional[int] = None


class ServiceUpdate(BaseModel):
    section: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None


class PortfolioOut(BaseModel):
    id: int
    title: str
    category: str
    emoji: Optional[str] = None
    subtitle: Optional[str] = None
    gradient: Optional[str] = None
    order: int
    is_visible: bool

    class Config:
        from_attributes = True


class PortfolioCreate(BaseModel):
    title: str
    category: str
    emoji: Optional[str] = None
    subtitle: Optional[str] = None
    gradient: Optional[str] = None
    order: Optional[int] = None


class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    emoji: Optional[str] = None
    subtitle: Optional[str] = None
    gradient: Optional[str] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None


class TestimonialOut(BaseModel):
    id: int
    initials: str
    name: str
    role: str
    content: str
    rating: int
    order: int
    is_visible: bool

    class Config:
        from_attributes = True


class TestimonialCreate(BaseModel):
    initials: str
    name: str
    role: str
    content: str
    rating: int = 5
    order: Optional[int] = None


class TestimonialUpdate(BaseModel):
    initials: Optional[str] = None
    name: Optional[str] = None
    role: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., max_length=255)
    company: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    service: Optional[str] = Field(None, max_length=255)
    message: str = Field(..., min_length=2, max_length=2000)


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    company: Optional[str] = None
    location: Optional[str] = None
    service: Optional[str] = None
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PublicWebsiteData(BaseModel):
    sections: list[WebsiteSectionOut]
    services: list[ServiceOut]
    portfolio: list[PortfolioOut]
    testimonials: list[TestimonialOut]
