import base64
import secrets

from sqlalchemy.orm import Session

from . import crud


def create_random_key(length: int = 8) -> str:
    """Generate a random uppercase alphanumeric key used as the secret_key suffix."""
    import string
    chars = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(chars) for _ in range(length))


def create_unique_key(db: Session, length: int = 5) -> str:
    """
    Generates a unique short key using random bytes encoded as base64url.
    Retries on the rare chance of a collision with an existing key.
    """
    while True:
        # Each byte gives ~6 bits of entropy; ceil(5 * 6 / 8) = 4 bytes is enough
        key = base64.urlsafe_b64encode(secrets.token_bytes(4)).decode()[:length]
        if not crud.get_db_url_by_key(db, key):
            return key
