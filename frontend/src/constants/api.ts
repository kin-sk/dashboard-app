// API Base URL
export const API_BASE_URL = "http://localhost:8000";

// API Endpoints
export const API_ENDPOINTS = {
  // 認証関連
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },
  // ブログ関連 ← 追加
  BLOG: {
    POSTS: "/api/posts",
    POST_DETAIL: (id: number) => `/api/posts/${id}`,
    CATEGORIES: "/api/categories",
    TAGS: "/api/tags",
  },
  // プロジェクト関連（今後）
  PROJECTS: {
    LIST: "/api/projects",
    DETAIL: (id: number) => `/api/projects/${id}`,
  },
  // 今後追加する機能用
  USERS: {
    LIST: "/api/users",
    DETAIL: (id: number) => `/api/users/${id}`,
  },
} as const;

// ストレージキー
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_INFO: "user_info",
} as const;
