from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from book_review import schemas, crud
from core.security import get_current_user_id,_token_header
from database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.ReviewResponse)
async def create_review(
    review: schemas.ReviewCreate, 
    db: AsyncSession = Depends(get_db), 
    token: str = _token_header
):
    current_user_id = await get_current_user_id(token, db)
    return await crud.create_review(db, review, current_user_id)

@router.put("/{review_id}", response_model=schemas.ReviewResponse)
async def update_review(
    review_id: int, 
    review: schemas.ReviewUpdate, 
    db: AsyncSession = Depends(get_db), 
    token: str = _token_header
):
    current_user_id = await get_current_user_id(token, db)
    return await crud.update_review(db, review_id, review, current_user_id)

@router.delete("/{review_id}", response_model=dict)
async def delete_review(
    review_id: int, 
    db: AsyncSession = Depends(get_db), 
    token: str = _token_header
):
    current_user_id = await get_current_user_id(token, db)
    return await crud.delete_review(db, review_id, current_user_id)

@router.get("/book/{book_id}", response_model=List[schemas.BookUserReviewResponse])
async def get_reviews_by_book(book_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_reviews_by_book(db, book_id)

@router.get("/user/{user_id}", response_model=List[schemas.UserReviewResponse])
async def get_reviews_by_user(user_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_reviews_by_user(db, user_id)
