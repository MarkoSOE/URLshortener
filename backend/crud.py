from sqlalchemy.orm import Session

from . import keygen, models, schemas


def get_db_url_by_key(db: Session, url_key: str) -> models.URL:
    """Return the active URL record matching the given short key, or None."""
    return (
        db.query(models.URL)
        .filter(models.URL.key == url_key, models.URL.is_active)
        .first()
    )


def create_db_url(db: Session, url: schemas.URLBase) -> models.URL:
    """Create a new shortened URL record and persist it to the database."""
    key = keygen.create_unique_key(db)
    secret_key = f"{key}_{keygen.create_random_key()}"
    db_url = models.URL(target_url=url.target_url, key=key, secret_key=secret_key)
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url


def get_db_url_by_secret_key(db: Session, secret_key: str) -> models.URL:
    """Return the active URL record matching the given secret/admin key, or None."""
    return (
        db.query(models.URL)
        .filter(models.URL.secret_key == secret_key, models.URL.is_active)
        .first()
    )


def update_clicks(db: Session, db_url: schemas.URL) -> models.URL:
    """Increment the click counter on a URL record fetched from the database."""
    db_url.clicks += 1
    db.commit()
    db.refresh(db_url)
    return db_url


def increment_clicks(db: Session, url_key: str) -> None:
    """Increment the click counter for a URL using a direct update (no ORM fetch)."""
    db.query(models.URL).filter(models.URL.key == url_key).update(
        {models.URL.clicks: models.URL.clicks + 1}
    )
    db.commit()


def deactivate_db_url_by_secret_key(db: Session, secret_key: str) -> models.URL:
    """Set is_active to False for the URL matching the secret key (soft delete)."""
    db_url = get_db_url_by_secret_key(db, secret_key)
    if db_url:
        db_url.is_active = False
        db.commit()
        db.refresh(db_url)
    return db_url
