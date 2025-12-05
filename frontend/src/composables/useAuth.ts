import { reactive, toRefs } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '@/constants/api'
import { VALIDATION_SETS, VALIDATION_RULES } from '@/constants/validation'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/messages'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
}

interface TokenResponse {
  access_token: string
  token_type: string
}

class AuthManager {
  private state = reactive({
    // フォームデータ
    email: '',
    password: '',
    
    // UI状態
    loading: false,
    errorMessage: '',
    successMessage: '',
  })

  // バリデーションルール
  public readonly emailRules = VALIDATION_SETS.email
  public readonly passwordRules = VALIDATION_SETS.password

  private router = useRouter()

  constructor() {}

  // Getters
  get email() { return this.state.email }
  get password() { return this.state.password }
  get loading() { return this.state.loading }
  get errorMessage() { return this.state.errorMessage }
  get successMessage() { return this.state.successMessage }

  // Setters
  set email(value: string) { this.state.email = value }
  set password(value: string) { this.state.password = value }

  // ログイン処理
  async login(): Promise<void> {
    this.state.loading = true
    this.state.errorMessage = ''
    
    try {
      const response = await axios.post<TokenResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        {
          email: this.state.email,
          password: this.state.password
        }
      )
      
      // トークンを保存
      this.saveToken(response.data.access_token)
      
      // ダッシュボードへリダイレクト
      this.router.push('/dashboard')
    } catch (error: any) {
      this.handleLoginError(error)
    } finally {
      this.state.loading = false
    }
  }

  // ログアウト処理
  logout(): void {
    this.removeToken()
    this.router.push('/login')
  }

  // ログイン状態チェック
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  // トークン取得
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  // Private Methods

  private saveToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  }

  private removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  private handleLoginError(error: any): void {
    if (error.response) {
      this.state.errorMessage = error.response.data.detail || 'ログインに失敗しました'
    } else {
      this.state.errorMessage = ERROR_MESSAGES.NETWORK_ERROR
    }
  }

  // フォームをリセット
  reset(): void {
    this.state.email = ''
    this.state.password = ''
    this.state.errorMessage = ''
    this.state.successMessage = ''
  }

  // リアクティブな状態をエクスポート
  public getState() {
    return toRefs(this.state)
  }
}

// Composable関数（ログイン用）
export function useLogin() {
  const manager = new AuthManager()
  
  return {
    // 状態
    ...manager.getState(),
    
    // バリデーション
    emailRules: manager.emailRules,
    passwordRules: manager.passwordRules,
    
    // メソッド
    login: () => manager.login(),
    reset: () => manager.reset(),
  }
}

// Composable関数（認証状態管理用）
export function useAuth() {
  const manager = new AuthManager()
  
  return {
    isAuthenticated: () => manager.isAuthenticated(),
    logout: () => manager.logout(),
    getToken: () => manager.getToken(),
  }
}