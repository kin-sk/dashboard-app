// API Base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

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
