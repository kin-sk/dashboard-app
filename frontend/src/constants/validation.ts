// バリデーションルール型
export type ValidationRule = (value: string) => boolean | string

// 共通バリデーションルール
export const VALIDATION_RULES = {
  // 必須チェック
  required: (fieldName: string): ValidationRule => {
    return (value: string) => !!value || `${fieldName}は必須です`
  },

  // 最小文字数
  minLength: (fieldName: string, min: number): ValidationRule => {
    return (value: string) => 
      value.length >= min || `${fieldName}は${min}文字以上で入力してください`
  },

  // 最大文字数
  maxLength: (fieldName: string, max: number): ValidationRule => {
    return (value: string) => 
      value.length <= max || `${fieldName}は${max}文字以内で入力してください`
  },

  // メールアドレス形式
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'メールアドレスの形式が正しくありません'
  },

  // パスワード形式（最低限の強度チェック）
  password: (value: string) => {
    if (value.length < 8) {
      return 'パスワードは8文字以上で入力してください'
    }
    return true
  },

  // パスワード（強力）
  strongPassword: (value: string) => {
    if (value.length < 8) {
      return 'パスワードは8文字以上で入力してください'
    }
    if (!/[A-Z]/.test(value)) {
      return 'パスワードには大文字を含めてください'
    }
    if (!/[a-z]/.test(value)) {
      return 'パスワードには小文字を含めてください'
    }
    if (!/[0-9]/.test(value)) {
      return 'パスワードには数字を含めてください'
    }
    return true
  },

  // 確認用パスワード
  confirmPassword: (password: string): ValidationRule => {
    return (value: string) => 
      value === password || 'パスワードが一致しません'
  },

  // ユーザー名形式（英数字とアンダースコアのみ）
  username: (value: string) => {
    const pattern = /^[a-zA-Z0-9_]+$/
    return pattern.test(value) || 'ユーザー名は英数字とアンダースコアのみ使用できます'
  },

  // 電話番号形式（日本）
  phone: (value: string) => {
    const pattern = /^(0[0-9]{9,10})$/
    return pattern.test(value) || '電話番号の形式が正しくありません'
  },

  // 郵便番号形式（日本）
  zipCode: (value: string) => {
    const pattern = /^\d{7}$|^\d{3}-\d{4}$/
    return pattern.test(value) || '郵便番号の形式が正しくありません（例: 1234567 または 123-4567）'
  },
}

// よく使う組み合わせのバリデーションセット
export const VALIDATION_SETS = {
  // ユーザー名
  username: [
    VALIDATION_RULES.required('ユーザー名'),
    VALIDATION_RULES.minLength('ユーザー名', 3),
    VALIDATION_RULES.maxLength('ユーザー名', 50),
    VALIDATION_RULES.username,
  ],

  // メールアドレス
  email: [
    VALIDATION_RULES.required('メールアドレス'),
    VALIDATION_RULES.email,
  ],

  // パスワード（通常）
  password: [
    VALIDATION_RULES.required('パスワード'),
    VALIDATION_RULES.password,
  ],

  // パスワード（強力）
  strongPassword: [
    VALIDATION_RULES.required('パスワード'),
    VALIDATION_RULES.strongPassword,
  ],
}