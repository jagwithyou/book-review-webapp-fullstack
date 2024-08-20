from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base
from passlib.context import CryptContext


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    display_name = Column(String, index=True)
    password = Column(String)
    email = Column(String, unique=True, index=True)
    invalid_attempt = Column(Integer, default=0)
    account_status = Column(Boolean, default=True)
    
class UserRole(Base):
    __tablename__ = 'user_roles'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    role = Column(String)  # e.g., 'admin', 'user'

