from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# =============================================
# 既存のスキーマ（認証関連）
# =============================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str


# =============================================
# ブログ関連のスキーマ
# =============================================

# カテゴリ
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# タグ
class TagBase(BaseModel):
    name: str
    slug: str

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# 記事
class PostBase(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    status: str = 'draft'
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = []

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    status: Optional[str] = None
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None

class PostResponse(BaseModel):
    id: int
    user_id: int
    category_id: Optional[int]
    title: str
    slug: str
    content: str
    excerpt: Optional[str]
    featured_image: Optional[str]
    status: str
    published_at: Optional[datetime]
    view_count: int
    created_at: datetime
    updated_at: datetime
    
    # リレーション
    author: UserResponse
    category: Optional[CategoryResponse]
    tags: List[TagResponse]

    class Config:
        from_attributes = True

class PostListResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    featured_image: Optional[str]
    status: str
    published_at: Optional[datetime]
    view_count: int
    created_at: datetime
    author: UserResponse
    category: Optional[CategoryResponse]
    tags: List[TagResponse]

    class Config:
        from_attributes = True