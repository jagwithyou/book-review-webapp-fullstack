from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, func
from user.models import User, UserRole
from user.schemas import UserCreate, UserUpdate, CurrentUser
from core.security import get_password_hash

async def create_user(db: AsyncSession, user: UserCreate) -> User:
    db_user = User(
        full_name=user.full_name,
        display_name=user.display_name,
        password=get_password_hash(user.password),
        email=user.email
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def update_user(db: AsyncSession, user_id: int, user_data: UserUpdate) -> User:
    user_data.password = get_password_hash(user_data.password)
    stmt = update(User).where(User.id == user_id).values(user_data.dict(exclude_unset=True))
    await db.execute(stmt)
    await db.commit()
    return await get_user(db, user_id)

async def get_user(db: AsyncSession, user_id: int) -> User:
    result = await db.execute(select(User).filter(User.id == user_id))
    return result.scalar_one_or_none()

async def get_Current_user_details(db: AsyncSession, user_id: int) -> CurrentUser:
    # Query to join User with UserRole
    query = (
        select(User, func.coalesce(UserRole.role, 'user').label('role'))
        .outerjoin(UserRole, User.id == UserRole.user_id)
        .filter(User.id == user_id)
    )
    result = await db.execute(query)
    user, role = result.one_or_none()

    if user:
        return {
            'id': user.id,
            'full_name': user.full_name,
            'display_name': user.display_name,
            'email': user.email,
            'role': role,
            'account_status': user.account_status
        }
    return None

async def get_user_from_email(db: AsyncSession, user_email: str) -> User:
    result = await db.execute(select(User).filter(User.email == user_email))
    return result.scalar_one_or_none()

async def activate_user(db: AsyncSession, user_id: int) -> User:
    stmt = update(User).where(User.id == user_id).values(account_status=True)
    await db.execute(stmt)
    await db.commit()
    return await get_user(db, user_id)

async def deactivate_user(db: AsyncSession, user_id: int) -> User:
    stmt = update(User).where(User.id == user_id).values(account_status=False)
    await db.execute(stmt)
    await db.commit()
    return await get_user(db, user_id)

async def add_user_role(db: AsyncSession, user_id: int, role: str) -> UserRole:
    user_role = UserRole(user_id=user_id, role=role)
    db.add(user_role)
    await db.commit()
    await db.refresh(user_role)
    return user_role

async def delete_user(db: AsyncSession, user_id: int):
    # Check if the user exists
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Delete all user_roles associated with the book
    await db.execute(
        UserRole.__table__.delete().where(UserRole.user_id == user_id)
    )
    # Delete the user
    await db.delete(user)
    await db.commit()
    return {"message": "User deleted successfully"}