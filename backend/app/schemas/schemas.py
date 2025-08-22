from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# 用户相关模型
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

# Todo相关模型
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "general"

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    category: Optional[str] = None

class Todo(TodoBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime
    owner_id: int

    class Config:
        orm_mode = True

# 令牌相关模型
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None