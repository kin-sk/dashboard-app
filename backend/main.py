from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(tatle="Dashboard API", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Dashborad API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# 以下、エンドポイントを追加していく
