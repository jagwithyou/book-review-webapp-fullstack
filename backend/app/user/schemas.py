from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    full_name: str
    display_name: str
    password: str
    email: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    display_name: Optional[str] = None
    password: Optional[str] = None
    email: EmailStr = None

class UserResponse(BaseModel):
    id: int
    full_name: str
    display_name: str
    email: str
    account_status: bool

    class Config:
        orm_mode = True
    
class CurrentUser(UserResponse):
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRoleBase(BaseModel):
    user_id: int
    role: str

class UserRoleCreate(UserRoleBase):
    pass

class UserRoleInDB(UserRoleBase):
    id: int

    class Config:
        orm_mode = True