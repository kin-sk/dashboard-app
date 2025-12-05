import { reactive, toRefs, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api'
import { VALIDATION_SETS, VALIDATION_RULES } from '@/constants/validation'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/messages'

interface RegisterData {
  username: string
  email: string
  password: string
}

class RegisterManager {
  private state = reactive({
    // フォームデータ
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // UI状態
    loading: false,
    errorMessage: '',
  })

  private router = useRouter()

  constructor() {}

  // Getters
  get username() { return this.state.username }
  get email() { return this.state.email }
  get password() { return this.state.password }
  get confirmPassword() { return this.state.confirmPassword }
  get loading() { return this.state.loading }
  get errorMessage() { return this.state.errorMessage }

  // Setters
  set username(value: string) { this.state.username = value }
  set email(value: string) { this.state.email = value }
  set password(value: string) { this.state.password = value }
  set confirmPassword(value: string) { this.state.confirmPassword = value }

  // バリデーションルール
  public readonly usernameRules = VALIDATION_SETS.username
  public readonly emailRules = VALIDATION_SETS.email
  public readonly passwordRules = VALIDATION_SETS.password
  
  // 確認用パスワードのバリデーション（動的に生成）
  get confirmPasswordRules() {
    return [
      VALIDATION_RULES.required('パスワード（確認）'),
      VALIDATION_RULES.confirmPassword(this.state.password)
    ]
  }

  // パスワードの強度チェック
  get passwordStrength(): 'weak' | 'medium' | 'strong' {
    const password = this.state.password
    if (password.length < 8) return 'weak'
    
    let strength = 0
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    
    if (strength <= 2) return 'weak'
    if (strength === 3) return 'medium'
    return 'strong'
  }

  // 登録処理
  async register(): Promise<void> {
    // パスワード確認
    if (this.state.password !== this.state.confirmPassword) {
      this.state.errorMessage = 'パスワードが一致しません'
      return
    }

    this.state.loading = true
    this.state.errorMessage = ''
    
    try {
      await axios.post<RegisterData>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
        {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        }
      )
      
      // 登録成功：ログインページへ
      alert(SUCCESS_MESSAGES.REGISTRATION_SUCCESS)
      this.router.push('/login')
    } catch (error: any) {
      this.handleRegisterError(error)
    } finally {
      this.state.loading = false
    }
  }

  // Private Methods

  private handleRegisterError(error: any): void {
    if (error.response) {
      this.state.errorMessage = error.response.data.detail || '登録に失敗しました'
    } else {
      this.state.errorMessage = ERROR_MESSAGES.NETWORK_ERROR
    }
  }

  // フォームをリセット
  reset(): void {
    this.state.username = ''
    this.state.email = ''
    this.state.password = ''
    this.state.confirmPassword = ''
    this.state.errorMessage = ''
  }

  // リアクティブな状態をエクスポート
  public getState() {
    return toRefs(this.state)
  }
}

// Composable関数
export function useRegister() {
  const manager = new RegisterManager()
  
  return {
    // 状態
    ...manager.getState(),
    
    // バリデーション
    usernameRules: manager.usernameRules,
    emailRules: manager.emailRules,
    passwordRules: manager.passwordRules,
    confirmPasswordRules: computed(() => manager.confirmPasswordRules),
    
    // 便利なプロパティ
    passwordStrength: computed(() => manager.passwordStrength),
    
    // メソッド
    register: () => manager.register(),
    reset: () => manager.reset(),
  }
}