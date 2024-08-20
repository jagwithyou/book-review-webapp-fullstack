from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from book_review import models, schemas
from book import models as book_models
from user import models as user_models
from core.security import is_admin
from fastapi import HTTPException

async def check_book_exists(db: AsyncSession, book_id: int):
    """Check if the book with the given ID exists in the database."""
    result = await db.execute(select(book_models.Book).filter(book_models.Book.id == book_id))
    book = result.scalars().first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

async def check_review_exists_and_belongs_to_user(db: AsyncSession, review_id: int, user_id: int):
    """Check if the review exists and belongs to the given user."""
    result = await db.execute(
        select(models.Review).filter(
            and_(
                models.Review.id == review_id,
                models.Review.user_id == user_id
            )
        )
    )
    review_db = result.scalars().first()
    if not review_db:
        raise HTTPException(status_code=403, detail="Review not found or you're not authorized to update it")
    return review_db

async def check_already_reviewed(db: AsyncSession, book_id: int, user_id: int):
    """Check if the the user already reviewed the book"""
    result = await db.execute(
        select(models.Review).filter(
            and_(
                models.Review.book_id == book_id,
                models.Review.user_id == user_id
            )
        )
    )
    existing_review = result.scalars().first()
    if existing_review:
        raise HTTPException(status_code=403, detail="You have already reviewed this book")

async def create_review(db: AsyncSession, review: schemas.ReviewCreate, current_user_id: int):
    # Check if the book exists
    await check_book_exists(db, review.book_id)
    # Check if the user has already reviewed this book
    await check_already_reviewed(db, review.book_id, current_user_id)
    # Create a new review
    new_review = models.Review(**review.dict(), user_id=current_user_id)
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    return new_review

async def update_review(db: AsyncSession, review_id: int, review: schemas.ReviewUpdate, current_user_id: int):
    # Check if the review exists and belongs to the current user
    review_db = await check_review_exists_and_belongs_to_user(db, review_id, current_user_id)
    # # Check if the book exists
    # await check_book_exists(db, review.book_id)
    # Update the review
    for key, value in review.dict(exclude_unset=True).items():
        setattr(review_db, key, value)
    await db.commit()
    await db.refresh(review_db)
    return review_db

async def delete_review(db: AsyncSession, review_id: int, current_user_id: int):
    # Check review is available
    result = await db.execute(select(models.Review).filter(models.Review.id == review_id))
    review_db = result.scalars().first()
    if not review_db:
        raise HTTPException(status_code=404, detail="Review not found")
    # Check the user access
    if review_db.user_id != current_user_id and not await is_admin(db, current_user_id):
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    # Delete review
    await db.delete(review_db)
    await db.commit()
    return {"message": "Review deleted successfully"}

async def get_reviews_by_book(db: AsyncSession, book_id: int):
    # Retrieve reviews for the book
    result = await db.execute(
        select(models.Review, user_models.User).join(user_models.User).filter(
            models.Review.book_id == book_id
        )
    )
    reviews = result.all()
    # Process reviews to handle deactivated users
    reviews_list = []
    for review, user in reviews:
        review_data = schemas.BookUserReviewResponse(
            book_id=review.book_id,
            id=review.id,
            display_name=user.display_name if user.account_status else "Unknown user",
            user_id= user.id,
            review_text=review.review_text,
            rating=review.rating
        )
        # review_data.display_name = user.display_name if user.account_status else "Unknown user"
        reviews_list.append(review_data)
    return reviews_list

async def get_reviews_by_user(db: AsyncSession, user_id: int):
    query = (select(models.Review, book_models.Book.title)
             .join(book_models.Book, book_models.Book.id == models.Review.book_id)
             .filter(models.Review.user_id == user_id))
    result = await db.execute(query)
    return [{"book_id": row.Review.book_id, "book_title": row.title, "review_text": row.Review.review_text, "rating": row.Review.rating} for row in result]
