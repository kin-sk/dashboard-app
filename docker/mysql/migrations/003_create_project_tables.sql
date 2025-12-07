-- =============================================
-- プロジェクト管理機能のテーブル
-- =============================================

-- プロジェクトテーブル
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled') DEFAULT 'planning',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12, 2),
    progress INT DEFAULT 0 COMMENT 'Progress percentage (0-100)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- プロジェクトメンバーテーブル
CREATE TABLE IF NOT EXISTS project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('owner', 'admin', 'member', 'viewer') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_project_user (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- タスクテーブル（プロジェクトに紐付く）
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_to INT COMMENT 'User ID of assigned person',
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('todo', 'in_progress', 'review', 'done', 'blocked') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    due_date DATE,
    estimated_hours DECIMAL(5, 2),
    actual_hours DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_project_id (project_id),
    INDEX idx_user_id (user_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- サンプルデータ
INSERT INTO projects (user_id, name, description, status, priority, start_date, end_date, budget, progress) VALUES
(1, 'ダッシュボードアプリ開発', 'Vue.js + FastAPIでダッシュボードアプリケーションを開発', 'active', 'high', '2025-12-01', '2026-03-31', 500000.00, 35),
(1, 'ECサイトリニューアル', 'オンラインショップのデザインと機能を刷新', 'planning', 'medium', '2026-01-15', '2026-06-30', 1000000.00, 5),
(1, 'モバイルアプリ開発', 'iOS/Android対応のネイティブアプリ開発', 'active', 'urgent', '2025-11-01', '2026-02-28', 800000.00, 60);

-- プロジェクトメンバー
INSERT INTO project_members (project_id, user_id, role) VALUES
(1, 1, 'owner'),
(2, 1, 'owner'),
(3, 1, 'owner');

-- タスク
INSERT INTO tasks (project_id, user_id, assigned_to, title, description, status, priority, due_date, estimated_hours) VALUES
(1, 1, 1, 'データベース設計', 'テーブル設計とER図の作成', 'done', 'high', '2025-12-05', 8.0),
(1, 1, 1, '認証機能の実装', 'ログイン・登録機能の実装', 'done', 'high', '2025-12-08', 16.0),
(1, 1, 1, 'プロフィール編集機能', 'ユーザープロフィールのCRUD実装', 'done', 'medium', '2025-12-10', 8.0),
(1, 1, 1, 'ブログ機能の実装', '記事投稿・編集・削除機能', 'in_progress', 'high', '2025-12-15', 24.0),
(1, 1, 1, 'プロジェクト管理機能', 'プロジェクトとタスクの管理機能', 'todo', 'high', '2025-12-20', 32.0),
(2, 1, 1, '要件定義', 'クライアントヒアリングと要件のまとめ', 'in_progress', 'urgent', '2025-12-12', 16.0),
(2, 1, 1, 'ワイヤーフレーム作成', 'UIデザインのワイヤーフレーム', 'todo', 'high', '2025-12-18', 12.0),
(3, 1, 1, 'API設計', 'バックエンドAPIの設計', 'in_progress', 'high', '2025-12-14', 20.0),
(3, 1, 1, 'UI実装（iOS）', 'iOSアプリのUI実装', 'in_progress', 'urgent', '2025-12-25', 40.0);