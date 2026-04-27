import validators
from cachetools import TTLCache
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from starlette.datastructures import URL

from . import crud, models, schemas
from .config import get_settings
from .database import SessionLocal, engine

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

url_cache: TTLCache = TTLCache(maxsize=1000, ttl=300)

origins = [o.strip() for o in get_settings().allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    """FastAPI dependency that provides a database session and ensures it is closed after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def raise_bad_request(message):
    """Raise a 400 Bad Request HTTP exception with the given message."""
    raise HTTPException(status_code=400, detail=message)


def raise_not_found(request):
    """Raise a 404 Not Found HTTP exception referencing the requested URL."""
    message = f"URL '{request.url}' does not exist"
    raise HTTPException(status_code=404, detail=message)


def get_admin_info(db_url: models.URL) -> schemas.URLInfo:
    """Attach the computed short URL and admin URL to a URL record before returning it."""
    base_url = URL(get_settings().base_url)
    admin_endpoint = app.url_path_for(
        "administration info", secret_key=db_url.secret_key
    )
    db_url.url = str(base_url.replace(path=db_url.key))
    db_url.admin_url = str(base_url.replace(path=admin_endpoint))
    return db_url


@app.get("/")
def read_root():
    """Health check endpoint confirming the API is running."""
    return "Welcome to the URL shortener API"


@app.get("/{url_key}")
def forward_to_target_url(
    url_key: str, request: Request, db: Session = Depends(get_db)
):
    """Redirect a short key to its target URL. Serves from cache when available."""
    if url_key in url_cache:
        crud.increment_clicks(db=db, url_key=url_key)
        return RedirectResponse(url_cache[url_key])
    if db_url := crud.get_db_url_by_key(db=db, url_key=url_key):
        url_cache[url_key] = db_url.target_url
        crud.update_clicks(db=db, db_url=db_url)
        return RedirectResponse(db_url.target_url)
    else:
        raise_not_found(request)


@app.get(
    "/admin/{secret_key}",
    name="administration info",
    response_model=schemas.URLInfo,
)
def get_url_info(secret_key: str, request: Request, db: Session = Depends(get_db)):
    """Return metadata (clicks, short URL, admin URL) for the URL matching the secret key."""
    if db_url := crud.get_db_url_by_secret_key(db, secret_key=secret_key):
        return get_admin_info(db_url)
    else:
        raise_not_found(request)


@app.post("/url", response_model=schemas.URLInfo)
def create_url(url: schemas.URLBase, db: Session = Depends(get_db)):
    """Validate the target URL and create a new shortened link."""
    if not validators.url(url.target_url):
        raise_bad_request(message="Your provided URL is not valid")
    db_url = crud.create_db_url(db=db, url=url)
    return get_admin_info(db_url)


@app.delete("/admin/{secret_key}")
def delete_url(secret_key: str, request: Request, db: Session = Depends(get_db)):
    """Deactivate the URL matching the secret key and evict it from the cache."""
    if db_url := crud.deactivate_db_url_by_secret_key(db, secret_key=secret_key):
        url_cache.pop(db_url.key, None)
        message = f"Successfully deleted shortened URL for '{db_url.target_url}'"
        return {"detail": message}
    else:
        raise_not_found(request)
