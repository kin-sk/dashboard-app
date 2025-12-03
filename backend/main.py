from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
from models import User
from schemas import LoginRequest, UserCreate, UserResponse, Token
from auth import (
    authenticate_user,
    create_access_token,
    hash_password,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI(title="Dashboard API", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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