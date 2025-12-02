# Dashboard App

Vue (TypeScript) + FastAPI (Python) + MySQL を使用したダッシュボードアプリケーション

## 技術スタック

- **フロントエンド**: Vue 3 + TypeScript + Vite
- **バックエンド**: FastAPI + Python 3.9 + Uvicorn
- **データベース**: MySQL 8.0
- **DB管理ツール**: phpMyAdmin
- **インフラ**: Docker + Docker Compose
- **OS**: Rocky Linux 8 (バックエンドコンテナ)

## 必要な環境

- Docker Desktop for Windows
- Git (推奨)
- SourceTree (推奨)

## Git管理について

このプロジェクトはGitで管理されています。詳細なセットアップ手順は [GIT_SETUP.md](./GIT_SETUP.md) を参照してください。

### クイックスタート

```bash
# リポジトリのクローン（GitHubからの場合）
git clone https://github.com/your-username/dashboard-app.git
cd dashboard-app

# Dockerコンテナの起動
docker-compose up -d --build
```

## セットアップ手順

### 1. プロジェクトのクローン/配置

このプロジェクトディレクトリをローカルに配置します。

### 2. Docker コンテナの起動

プロジェクトルートで以下のコマンドを実行：

**PowerShellの場合:**
```powershell
docker compose up -d --build
```

**Git Bash/WSL/Linuxの場合:**
```bash
docker compose up -d --build
```

初回は以下の処理が実行されます：
- バックエンドイメージのビルド (Rocky Linux 8 + Python)
- フロントエンドイメージのビルド (Node.js)
- MySQLコンテナの起動とデータベース初期化

### 3. アクセス確認

- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs
- **phpMyAdmin**: http://localhost:8080
  - ユーザー名: `root`
  - パスワード: `password`
- **MySQL**: localhost:3306

### 4. 停止方法

**PowerShellの場合:**
```powershell
docker compose down
```

データベースを含めて完全に削除する場合：

```powershell
docker compose down -v
```

**Git Bash/WSL/Linuxの場合:**
```bash
docker compose down
docker compose down -v  # データベース含めて削除
```

## 開発時のコマンド

### ログの確認

**PowerShellの場合:**
```powershell
# 全てのサービスのログ
docker compose logs -f

# 特定のサービスのログ
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

### コンテナに入る

**PowerShellの場合:**
```powershell
# バックエンドコンテナ
docker compose exec backend bash

# フロントエンドコンテナ
docker compose exec frontend sh

# MySQLコンテナ
docker compose exec mysql bash
```

### MySQLに接続

**PowerShellの場合:**
```powershell
docker compose exec mysql mysql -u root -p
# パスワード: password
```

## プロジェクト構造

```
dashboard-app/
├── docker-compose.yml          # Docker Compose設定
├── backend/                    # FastAPIバックエンド
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py
├── frontend/                   # Vueフロントエンド
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.ts
│       ├── App.vue
│       ├── router/
│       └── views/
└── docker/
    └── mysql/
        └── init.sql            # MySQL初期化スクリプト
```

## トラブルシューティング

### PowerShellで docker-compose が使えない

Docker Desktop最新版では `docker compose`（ハイフンなし）を使用します：

```powershell
# ✅ 正しい
docker compose up -d

# ❌ 古い書き方
docker-compose up -d
```

### ポートが既に使用されている

他のアプリケーションがポート 5173, 8000, 8080, 3306 を使用している場合、`docker-compose.yml` のポート設定を変更してください。

例：phpMyAdminのポートを変更する場合
```yaml
phpmyadmin:
  ports:
    - "8081:80"  # 8080 → 8081 に変更
```

### フロントエンドが起動しない

**PowerShellの場合:**
```powershell
docker compose logs frontend
```

でエラーを確認してください。npm install のエラーの場合は：

```powershell
docker compose down
docker compose up -d --build
```

### データベース接続エラー

MySQLコンテナが完全に起動するまで30秒ほどかかる場合があります。少し待ってから再度アクセスしてください。

## 次のステップ

1. Firebaseの設定追加
2. 認証機能の実装
3. API エンドポイントの追加
4. データベースモデルの追加
5. AWS へのデプロイ設定

## ライセンス

MIT