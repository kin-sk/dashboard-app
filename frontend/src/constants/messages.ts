// 成功メッセージ
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "プロフィールを更新しました",
  PASSWORD_CHANGED: "パスワードを変更しました",
  REGISTRATION_SUCCESS: "登録が完了しました",
  LOGIN_SUCCESS: "ログインしました",
  LOGOUT_SUCCESS: "ログアウトしました",
} as const;

// エラーメッセージ
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "サーバーに接続できません",
  UNAUTHORIZED: "認証に失敗しました。再度ログインしてください",
  FETCH_FAILED: "データの取得に失敗しました",
  UPDATE_FAILED: "更新に失敗しました",
  DELETE_FAILED: "削除に失敗しました",
  VALIDATION_ERROR: "入力内容を確認してください",
  UNKNOWN_ERROR: "予期しないエラーが発生しました",
  CURRENT_PASSWORD_INCORRECT: "現在のパスワードが正しくありません",
  PASSWORD_MISMATCH: "新しいパスワードが一致しません",
} as const;
