# Dev Container 開発ガイド

## 🚀 起動方法

### 1. コンテナの起動
```powershell
# 既存のコンテナを停止
docker compose down

# 新しい構成でビルド＆起動
docker compose up -d --build

# 起動確認
docker compose ps
```

### 2. VS Codeでコンテナに接続

1. VS Codeでプロジェクトを開く
2. 左下の緑色のアイコン（><）をクリック
3. 「コンテナーで再度開く」を選択
4. コンテナ内で開くまで待つ（初回は数分かかります）

### 3. アプリケーションの起動

#### 方法A: タスクから起動（推奨）

1. `Ctrl + Shift + P` を押す
2. 「Tasks: Run Task」を選択
3. 「Start Both」を選択（バックエンド＆フロントエンドを同時起動）

#### 方法B: ターミナルから個別起動

**バックエンド:**
```bash
cd /workspace/backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**フロントエンド（新しいターミナルで）:**
```bash
cd /workspace/frontend
npm run dev
```

## 🌐 アクセスURL

- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs
- **phpMyAdmin**: http://localhost:8080

## 🛠️ よく使うコマンド

### Python関連
```bash
cd /workspace/backend
pip3 install -r requirements.txt
python3 main.py
```

### Node.js関連
```bash
cd /workspace/frontend
npm install
npm run dev
npm run build
```

### Git操作
```bash
cd /workspace
git status
git add .
git commit -m "message"
git push
```

## 🔄 コンテナから出る

1. VS Code左下の緑色のアイコンをクリック
2. 「ローカルで再度開く」を選択

## 🛑 終了方法
```powershell
# コンテナを停止
docker compose down

# データベースも削除する場合
docker compose down -v
```

## 💡 Tips

- コンテナ内でファイルを編集すると、自動でホスト側にも反映されます
- Git操作はコンテナ内でもホスト側でも可能です
- デバッグはVS Codeのデバッグ機能が使えます