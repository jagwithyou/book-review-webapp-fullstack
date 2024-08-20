from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from book import schemas, crud
from core.security import get_current_user_id, is_admin, _token_header
from database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.BookResponse)
async def create_book(
    book: schemas.BookCreate, 
    db: AsyncSession = Depends(get_db), 
    token: str = _token_header
):
    current_user_id = await get_current_user_id(token, db)
    if not await is_admin(db, current_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    return await crud.create_book(db, book, current_user_id)

@router.put("/{book_id}", response_model=schemas.BookResponse)
async def update_book(
    book_id: int, 
    book: schemas.BookUpdate, 
    db: AsyncSession = Depends(get_db), 
    token: str = _token_header
):
    current_user_id = await get_current_user_id(token, db)
    if not await is_admin(db, current_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    return await crud.update_book(db, book_id, book, current_user_id)

@router.delete("/{book_id}", response_model=dict)
async def delete_book(
    book_id: int, 
    db: AsyncSession = Depends(get_db), 
    token: str = _token_header
):
    current_user_id = await get_current_user_id(token, db)
    if not await is_admin(db, current_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    return await crud.delete_book(db, book_id, current_user_id)

@router.get("/{book_id}", response_model=schemas.BookResponse)
async def get_book(book_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_book(db, book_id)

@router.get("/", response_model=List[schemas.BookResponse])
async def get_books(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.get_books(db, skip, limit)
