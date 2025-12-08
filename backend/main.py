from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import List, Optional

from database import get_db
from models import User, Post, Category, Tag, PostTag
from schemas import (
    LoginRequest, UserCreate, UserResponse, Token, PasswordChange,
    CategoryCreate, CategoryResponse,
    TagCreate, TagResponse,
    PostCreate, PostUpdate, PostResponse, PostListResponse
)
from auth import (
    authenticate_user,
    create_access_token,
    hash_password,
    verify_password,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI(title="Dashboard API", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================
# 既存のエンドポイント（省略）
# =============================================


@app.get("/")
async def root():
    return {"message": "Dashboard API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# ログインエンドポイント
@app.post("/api/auth/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが間違っています",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# ユーザー登録エンドポイント
@app.post("/api/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # メールアドレスの重複チェック
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このメールアドレスは既に登録されています"
        )
    
    # ユーザー名の重複チェック
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このユーザー名は既に使用されています"
        )
    
    # 新しいユーザーを作成
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# 現在のユーザー情報取得エンドポイント
@app.get("/api/auth/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# ログアウトエンドポイント（トークンを無効化する場合はクライアント側で削除）
@app.post("/api/auth/logout")
async def logout():
    return {"message": "ログアウトしました"}

# ユーザー情報更新エンドポイント
@app.put("/api/auth/me", response_model=UserResponse)
async def update_user_profile(
    user_data: dict,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # ユーザー名の更新（提供されている場合）
    if "username" in user_data:
        # 重複チェック
        existing_user = db.query(User).filter(
            User.username == user_data["username"],
            User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="このユーザー名は既に使用されています"
            )
        current_user.username = user_data["username"]
    
    # メールアドレスの更新（提供されている場合）
    if "email" in user_data:
        # 重複チェック
        existing_email = db.query(User).filter(
            User.email == user_data["email"],
            User.id != current_user.id
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="このメールアドレスは既に使用されています"
            )
        current_user.email = user_data["email"]
    
    db.commit()
    db.refresh(current_user)
    
    return current_user
# パスワード変更エンドポイント
from schemas import PasswordChange

@app.put("/api/auth/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # 現在のパスワードを確認
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="現在のパスワードが正しくありません"
        )
    
    # 新しいパスワードと確認用パスワードが一致するか確認
    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="新しいパスワードが一致しません"
        )
    
    # パスワードを更新
    current_user.password_hash = hash_password(password_data.new_password)
    db.commit()
    
    return {"message": "パスワードを変更しました"}

    # =============================================
# カテゴリAPI
# =============================================

@app.get("/api/categories", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    """カテゴリ一覧を取得"""
    categories = db.query(Category).all()
    return categories

@app.post("/api/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category: CategoryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """カテゴリを作成"""
    # 重複チェック
    existing = db.query(Category).filter(
        (Category.name == category.name) | (Category.slug == category.slug)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このカテゴリ名またはスラッグは既に使用されています"
        )
    
    new_category = Category(**category.dict())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


# =============================================
# タグAPI
# =============================================

@app.get("/api/tags", response_model=List[TagResponse])
async def get_tags(db: Session = Depends(get_db)):
    """タグ一覧を取得"""
    tags = db.query(Tag).all()
    return tags

@app.post("/api/tags", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(
    tag: TagCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """タグを作成"""
    # 重複チェック
    existing = db.query(Tag).filter(
        (Tag.name == tag.name) | (Tag.slug == tag.slug)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このタグ名またはスラッグは既に使用されています"
        )
    
    new_tag = Tag(**tag.dict())
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag


# =============================================
# 記事API
# =============================================

@app.get("/api/posts", response_model=List[PostListResponse])
async def get_posts(
    status: Optional[str] = Query(None, description="記事のステータス（draft, published, archived）"),
    category_id: Optional[int] = Query(None, description="カテゴリID"),
    tag_id: Optional[int] = Query(None, description="タグID"),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """記事一覧を取得"""
    query = db.query(Post)
    
    # ステータスでフィルタ
    if status:
        query = query.filter(Post.status == status)
    
    # カテゴリでフィルタ
    if category_id:
        query = query.filter(Post.category_id == category_id)
    
    # タグでフィルタ
    if tag_id:
        query = query.join(PostTag).filter(PostTag.tag_id == tag_id)
    
    # 最新順でソート
    query = query.order_by(Post.created_at.desc())
    
    # ページネーション
    posts = query.offset(offset).limit(limit).all()
    return posts

@app.get("/api/posts/{post_id}", response_model=PostResponse)
async def get_post(post_id: int, db: Session = Depends(get_db)):
    """記事詳細を取得"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="記事が見つかりません"
        )
    
    # 閲覧数を増加
    post.view_count += 1
    db.commit()
    
    return post

@app.post("/api/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post: PostCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """記事を作成"""
    # スラッグの重複チェック
    existing = db.query(Post).filter(Post.slug == post.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このスラッグは既に使用されています"
        )
    
    # 記事データを準備
    post_data = post.dict()
    tag_ids = post_data.pop('tag_ids', [])
    
    # 公開ステータスの場合は公開日時を設定
    if post.status == 'published':
        post_data['published_at'] = datetime.utcnow()
    
    # 記事を作成
    new_post = Post(**post_data, user_id=current_user.id)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    # タグを関連付け
    if tag_ids:
        for tag_id in tag_ids:
            post_tag = PostTag(post_id=new_post.id, tag_id=tag_id)
            db.add(post_tag)
        db.commit()
        db.refresh(new_post)
    
    return new_post

@app.put("/api/posts/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_update: PostUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """記事を更新"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="記事が見つかりません"
        )
    
    # 作成者のみ編集可能
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="この記事を編集する権限がありません"
        )
    
    # 更新データを準備
    update_data = post_update.dict(exclude_unset=True)
    tag_ids = update_data.pop('tag_ids', None)
    
    # スラッグの重複チェック
    if 'slug' in update_data:
        existing = db.query(Post).filter(
            Post.slug == update_data['slug'],
            Post.id != post_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="このスラッグは既に使用されています"
            )
    
    # ステータスが公開に変更された場合
    if update_data.get('status') == 'published' and post.status != 'published':
        update_data['published_at'] = datetime.utcnow()
    
    # 記事を更新
    for key, value in update_data.items():
        setattr(post, key, value)
    
    # タグを更新
    if tag_ids is not None:
        # 既存のタグを削除
        db.query(PostTag).filter(PostTag.post_id == post_id).delete()
        # 新しいタグを追加
        for tag_id in tag_ids:
            post_tag = PostTag(post_id=post_id, tag_id=tag_id)
            db.add(post_tag)
    
    db.commit()
    db.refresh(post)
    return post

@app.delete("/api/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """記事を削除"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="記事が見つかりません"
        )
    
    # 作成者のみ削除可能
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="この記事を削除する権限がありません"
        )
    
    db.delete(post)
    db.commit()
    return None