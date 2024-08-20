from pydantic import BaseModel

class ReviewBase(BaseModel):
    book_id: int
    review_text: str
    rating: int

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    review_text: str
    rating: int

class ReviewResponse(ReviewBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class UserReviewResponse(BaseModel):
    book_id: int
    book_title: str
    review_text: str
    rating: int

    class Config:
        orm_mode = True

class BookUserReviewResponse(ReviewBase):
    user_id: int
    display_name: str
    id: int

    class Config:
        orm_mode = True
        from_attributes = True
