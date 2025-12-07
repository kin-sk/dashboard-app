-- =============================================
-- ブログ機能のテーブル
-- =============================================

-- カテゴリテーブル
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- タグテーブル
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 記事テーブル
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 記事とタグの中間テーブル
CREATE TABLE IF NOT EXISTS post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- サンプルデータ
INSERT INTO categories (name, slug, description) VALUES
('技術', 'tech', 'プログラミングや技術に関する記事'),
('ライフハック', 'lifehack', '生活を便利にする情報'),
('ビジネス', 'business', 'ビジネスに関する記事');

INSERT INTO tags (name, slug) VALUES
('Python', 'python'),
('JavaScript', 'javascript'),
('Vue.js', 'vuejs'),
('FastAPI', 'fastapi'),
('Docker', 'docker'),
('初心者向け', 'beginner');

INSERT INTO posts (user_id, category_id, title, slug, content, excerpt, status, published_at) VALUES
(1, 1, 'FastAPIで簡単にAPIを作る方法', 'fastapi-tutorial', 
'FastAPIは高速で使いやすいPythonのWebフレームワークです。本記事では、基本的な使い方を解説します。', 
'FastAPIの基本的な使い方を初心者向けに解説します。',
'published', NOW()),
(1, 1, 'Vue.jsとVuetifyでモダンなUIを作成', 'vuejs-vuetify-ui',
'Vue.jsとVuetifyを使って、美しいマテリアルデザインのUIを簡単に作成できます。',
'VuetifyでモダンなUIを作成する方法を紹介します。',
'published', NOW()),
(1, 2, '効率的なタスク管理術', 'efficient-task-management',
'タスク管理を効率化するためのテクニックを紹介します。',
'効率的にタスクを管理するコツ',
'draft', NULL);

-- 記事とタグの関連付け
INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 4), -- FastAPI記事にFastAPIタグ
(1, 1), -- FastAPI記事にPythonタグ
(1, 6), -- FastAPI記事に初心者向けタグ
(2, 3), -- Vue.js記事にVue.jsタグ
(2, 2), -- Vue.js記事にJavaScriptタグ
(2, 6); -- Vue.js記事に初心者向けタグ