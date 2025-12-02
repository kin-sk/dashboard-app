from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# ログインリクエスト
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ユーザー登録リクエスト
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# ユーザーレスポンス
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# トークンレスポンス
class Token(BaseModel):
    access_token: str
    token_type: str

# トークンデータ
class TokenData(BaseModel):
    email: Optional[str] = None