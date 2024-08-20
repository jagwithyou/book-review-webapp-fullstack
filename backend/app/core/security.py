from passlib.context import CryptContext
from fastapi import HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from user.models import User, UserRole
import jwt
from datetime import datetime, timedelta, timezone
from core.config import SECRET_KEY,ALGORITHM,ACCESS_TOKEN_EXPIRE_SECONDS
import boto3, os

# Defining global settings
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
_token_header = Header(alias="x-access-token",
                        description="The token associated with the user obtained from the login API.",
                        )

def get_password_hash(password: str) -> str:
    """
    Returns the hashed password from the given password.

    Args:
        password (str): The password to be hashed.

    Returns:
        str: The hashed password.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies if the plain password matches the hashed password.

    Args:
        plain_password (str): The plain password to be verified.
        hashed_password (str): The hashed password to be verified against.

    Returns:
        bool: True if the passwords match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

async def is_admin(db: AsyncSession, user_id: int) -> bool:
    """
    Checks if the user with the given ID is an admin.

    Args:
        db (AsyncSession): The database session.
        user_id (int): The ID of the user to be checked.

    Returns:
        bool: True if the user is an admin, False otherwise.
    """
    result = await db.execute(
        select(UserRole).filter(UserRole.user_id == user_id, UserRole.role == "admin")
    )
    return result.scalar_one_or_none() is not None

def create_jwt_token(user_id: int) -> str:
    """
    Creates a JWT token for the user with the given ID.

    Args:
        user_id (int): The ID of the user.

    Returns:
        str: The JWT token.
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt_token(token: str) -> dict:
    """
    Decodes the JWT token and returns the payload.

    Args:
        token (str): The JWT token to be decoded.

    Returns:
        dict: The payload of the JWT token.

    Raises:
        HTTPException: If the token is invalid.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("exp") and payload["exp"] < datetime.now(timezone.utc).timestamp():
            raise HTTPException(status_code=401, detail="Token has expired")
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user_id(token: str, db: AsyncSession) -> int:
    """
    Gets the ID of the current user from the JWT token.

    Args:
        token (str): The JWT token.
        db (AsyncSession): The database session.

    Returns:
        int: The ID of the current user.

    Raises:
        HTTPException: If the token is invalid or the user is not found.
    """
    payload = decode_jwt_token(token)
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    # Verify that the user exists in the database
    user = await db.execute(select(User).filter(User.id == user_id))
    user = user.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_id


s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name="us-east-1"
)

async def upload_file_to_s3(file_obj, bucket_name, key):
    try:
        s3_client.upload_fileobj(file_obj, bucket_name, key)
        return f"https://{bucket_name}.s3.amazonaws.com/{key}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))