import json
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent


def content_path() -> Path:
    for p in [BACKEND_DIR / "content.json", BACKEND_DIR.parent / "content.json"]:
        if p.is_file():
            return p
    return BACKEND_DIR / "content.json"


def load_content() -> dict:
    try:
        with open(content_path()) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_content(data: dict):
    with open(content_path(), "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def sync_section(key: str, content):
    data = load_content()
    data[key] = content
    save_content(data)


def sync_services(connect, properties):
    data = load_content()
    services = data.setdefault("services", {})
    if connect is not None:
        connect_sec = services.setdefault("connect", {})
        connect_sec["items"] = [{"name": s.name, "desc": s.description} for s in connect]
    if properties is not None:
        props_sec = services.setdefault("properties", {})
        props_sec["items"] = [{"name": s.name, "desc": s.description} for s in properties]
    save_content(data)


def sync_portfolio(items):
    data = load_content()
    data["portfolio"] = [
        {
            "title": i.title,
            "category": i.category,
            "emoji": i.emoji or "",
            "subtitle": i.subtitle or "",
            "gradient": i.gradient or "",
        }
        for i in items
    ]
    save_content(data)


def sync_testimonials(items):
    data = load_content()
    data["testimonials"] = [
        {
            "initials": i.initials,
            "name": i.name,
            "role": i.role,
            "content": i.content,
            "rating": i.rating,
        }
        for i in items
    ]
    save_content(data)
