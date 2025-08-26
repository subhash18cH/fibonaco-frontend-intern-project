"""
SQLAlchemy Table + Models for Intern Project
Author: Dhaval Shrishrimal 

IMPORTANT: DO NOT CHANGE OR EDIT THIS FILE.
"""

# External Imports
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from pydantic import BaseModel, EmailStr, Field
from fastapi_users.db import SQLAlchemyBaseUserTable

# Internal Imports
from database import Base

# Database Models
class User(SQLAlchemyBaseUserTable[int], Base):
    """
    User Model for FastAPI-Users.
    
    Inherits from SQLAlchemyBaseUserTable which provides:
    - email: str (unique, indexed)
    - hashed_password: str
    - is_active: bool
    - is_superuser: bool
    - is_verified: bool
    
    Additional Columns:
        id: int - autoincremented user ID
        name: str - Name of the user
    """
    
    # Table Params
    __tablename__ = 'users'
    __table_args__ = {'sqlite_autoincrement': True} 

    # Table Columns
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True) # Primary Key
    name: Mapped[str] = mapped_column(String(100), nullable=False)


# Request Models
class PlainUserID(BaseModel):
    """Model Representing a Plain User ID"""
    id: int = Field(..., ge=1, description='Unique ID per User')

class ChangeStatus(BaseModel):
    """Model Representing a Change User Status Request"""
    id: int = Field(..., ge=1, description='Unique ID per User')
    is_superuser: bool = Field(..., description='Updated Admin Status of the User')


# Response Models
class SingleUserRow(BaseModel):
    """Model Representing a Single Row / User"""
    id: int = Field(..., ge=1, description='Unique ID per User')
    name: str = Field(..., description='Name of the User')
    email: EmailStr = Field(..., description='Email of the User')
    is_superuser: bool = Field(..., description='Is the User an Admin?')
    is_verified: bool = Field(..., description='Is the User Verified?')

    class Config:
        from_attributes = True

class UserResponseModel(BaseModel):
    """Model Representing the Response Page for User Queries"""
    page: int = Field(..., ge=1, description='Current Page Number')
    has_next: bool = Field(..., description='Is there a next page?')
    data: list[SingleUserRow] = Field(..., description='List of Users')