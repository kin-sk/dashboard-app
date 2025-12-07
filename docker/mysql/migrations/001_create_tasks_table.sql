-- タスクテーブルの作成
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- サンプルデータの挿入（テスト用）
INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES
(1, 'プロジェクトの企画書を作成', '新規プロジェクトの企画書を作成する', 'todo', 'high', '2025-12-15'),
(1, 'クライアントミーティング', '次回のクライアントミーティングの準備', 'in_progress', 'medium', '2025-12-10'),
(1, 'コードレビュー', 'チームメンバーのコードをレビュー', 'done', 'low', '2025-12-05');