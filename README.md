# Dashboard App

Vue (TypeScript) + FastAPI (Python) + MySQL を使用したダッシュボードアプリケーション

## 技術スタック

- **フロントエンド**: Vue 3 + TypeScript + Vite
- **バックエンド**: FastAPI + Python 3.9 + Uvicorn
- **データベース**: MySQL 8.0
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

```bash
docker-compose up -d --build
```

初回は以下の処理が実行されます：
- バックエンドイメージのビルド (Rocky Linux 8 + Python)
- フロントエンドイメージのビルド (Node.js)
- MySQLコンテナの起動とデータベース初期化

### 3. アクセス確認

- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs
- **MySQL**: localhost:3306

### 4. 停止方法

```bash
docker-compose down
```

データベースを含めて完全に削除する場合：

```bash
docker-compose down -v
```

## 開発時のコマンド

### ログの確認

```bash
# 全てのサービスのログ
docker-compose logs -f

# 特定のサービスのログ
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### コンテナに入る

```bash
# バックエンドコンテナ
docker-compose exec backend bash

# フロントエンドコンテナ
docker-compose exec frontend sh

# MySQLコンテナ
docker-compose exec mysql bash
```

### MySQLに接続

```bash
docker-compose exec mysql mysql -u root -p
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

### ポートが既に使用されている

他のアプリケーションがポート 5173, 8000, 3306 を使用している場合、`docker-compose.yml` のポート設定を変更してください。

### フロントエンドが起動しない

```bash
docker-compose logs frontend
```

でエラーを確認してください。npm install のエラーの場合は：

```bash
docker-compose down
docker-compose up -d --build
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