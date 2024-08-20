from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from book import models, schemas
from fastapi import HTTPException
from book_review import models as review_models

async def create_book(db: AsyncSession, book: schemas.BookCreate, current_user_id: int):
    new_book = models.Book(**book.dict())
    db.add(new_book)
    await db.commit()
    await db.refresh(new_book)
    return new_book

async def update_book(db: AsyncSession, book_id: int, book: schemas.BookUpdate, current_user_id: int):
    # Verify the book exists
    result = await db.execute(select(models.Book).filter(models.Book.id == book_id))
    book_db = result.scalars().first()
    if not book_db:
        raise HTTPException(status_code=404, detail="Book not found")
    # Update the book details
    for key, value in book.dict(exclude_unset=True).items():
        setattr(book_db, key, value)
    await db.commit()
    await db.refresh(book_db)
    return book_db

async def delete_book(db: AsyncSession, book_id: int, current_user_id: int):
    # Verify the book exists
    result = await db.execute(select(models.Book).filter(models.Book.id == book_id))
    book_db = result.scalars().first()
    if not book_db:
        raise HTTPException(status_code=404, detail="Book not found")
    # Delete all reviews associated with the book
    await db.execute(
        review_models.Review.__table__.delete().where(review_models.Review.book_id == book_id)
    )
    # Delete book
    await db.delete(book_db)
    await db.commit()
    return {"message": "Book deleted successfully"}

async def get_book(db: AsyncSession, book_id: int):
    result = await db.execute(select(models.Book).filter(models.Book.id == book_id))
    book_db = result.scalars().first()
    if not book_db:
        raise HTTPException(status_code=404, detail="Book not found")
    return book_db

async def get_books(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Book).offset(skip).limit(limit))
    return result.scalars().all()
