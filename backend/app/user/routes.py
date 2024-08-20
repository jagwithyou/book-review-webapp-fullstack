from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from user import schemas, crud
from core.security import get_current_user_id, is_admin, create_jwt_token, verify_password, \
                        _token_header, upload_file_to_s3
from database import get_db
from typing import Literal

router = APIRouter()

@router.post("/upload_file")
async def upload_file(
    upload_reason: Literal["books", "profile"],
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    token: str = _token_header
):
    current_user_id = await get_current_user_id(token, db)
    if not await is_admin(db, current_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    
    # Generate a unique S3 key (filename) and
    s3_key = f"{upload_reason}/{current_user_id}_{file.filename}"
    file_url = await upload_file_to_s3(file.file, "bookreviewapp", s3_key)
    return {"msg": "file uploaded successfully",
            "file_url": file_url}

@router.post("/", response_model=schemas.UserResponse)
async def create_user(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_user(db, user)

@router.put("/{user_id}", response_model=schemas.UserResponse)
async def update_user(user_id: int, user: schemas.UserUpdate, db: AsyncSession = Depends(get_db)):
    return await crud.update_user(db, user_id, user)

@router.get("/{user_id}", response_model=schemas.UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/{user_id}/role/{role}", response_model=schemas.UserRoleCreate)
async def add_user_role(user_id: int, role: str, db: AsyncSession = Depends(get_db), token: str = _token_header):
    current_user_id = await get_current_user_id(token, db)
    if not await is_admin(db, current_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    return await crud.add_user_role(db, user_id, role)

@router.post("/login")
async def login(user: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user_from_email(db, user.email)
    if db_user is None or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not db_user.account_status:
        raise HTTPException(status_code=401, detail="Account is deactivated")
    token = create_jwt_token(db_user.id)
    return {"access_token": token, "token_type": "x-access-token", "user_id": db_user.id, "email":db_user.email}

@router.post("/{user_id}/activate", response_model=schemas.UserResponse)
async def activate_user(user_id: int, db: AsyncSession = Depends(get_db), token: str = _token_header):
    current_user_id = await get_current_user_id(token, db)
    if not await is_admin(db, current_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    return await crud.activate_user(db, user_id)

@router.post("/{user_id}/deactivate", response_model=schemas.UserResponse)
async def deactivate_user(user_id: int, db: AsyncSession = Depends(get_db), token: str = _token_header):
    current_user_id = await get_current_user_id(token, db)
    if not await is_admin(db, current_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    return await crud.deactivate_user(db, user_id)

@router.delete("/{user_id}")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db), token: str = _token_header):
    current_user_id = await get_current_user_id(token, db)
    if not await is_admin(db, current_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    return await crud.delete_user(db, user_id)

@router.get("/me/", response_model=schemas.CurrentUser)
async def get_current_user(db: AsyncSession = Depends(get_db), token: str = _token_header):
    current_user_id = await get_current_user_id(token, db)
    return await crud.get_Current_user_details(db, current_user_id)

