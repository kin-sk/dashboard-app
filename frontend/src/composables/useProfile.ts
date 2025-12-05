import { reactive, toRefs } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '@/constants/api'
import { VALIDATION_SETS } from '@/constants/validation'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/messages'

interface UserProfile {
  username: string
  email: string
}

class ProfileManager {
  // 状態
  private state = reactive({
    // フォームデータ
    username: '',
    email: '',
    originalUsername: '',
    originalEmail: '',
    
    // UI状態
    loading: false,
    saving: false,
    isEditing: false,
    
    // メッセージ
    errorMessage: '',
    successMessage: '',
  })

  // バリデーションルール
  public readonly usernameRules = VALIDATION_SETS.username
  public readonly emailRules = VALIDATION_SETS.email

  private router = useRouter()

  constructor() {
    // 初期化時にプロフィールを取得
    this.fetchProfile()
  }

  // Getters
  get username() { return this.state.username }
  get email() { return this.state.email }
  get loading() { return this.state.loading }
  get saving() { return this.state.saving }
  get isEditing() { return this.state.isEditing }
  get errorMessage() { return this.state.errorMessage }
  get successMessage() { return this.state.successMessage }

  // Setters
  set username(value: string) { this.state.username = value }
  set email(value: string) { this.state.email = value }
  set isEditing(value: boolean) { this.state.isEditing = value }

  // 変更があるかチェック
  get hasChanges(): boolean {
    return (
      this.state.username !== this.state.originalUsername ||
      this.state.email !== this.state.originalEmail
    )
  }

  // プロフィール取得
  async fetchProfile(): Promise<void> {
    this.state.loading = true
    this.state.errorMessage = ''
    
    try {
      const token = this.getToken()
      if (!token) {
        this.redirectToLogin()
        return
      }

      const response = await axios.get<UserProfile>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      this.setProfileData(response.data)
    } catch (error: any) {
      this.handleError(error, ERROR_MESSAGES.FETCH_FAILED)
    } finally {
      this.state.loading = false
    }
  }

  // プロフィール更新
  async updateProfile(): Promise<void> {
    if (!this.hasChanges) {
      this.state.errorMessage = '変更がありません'
      return
    }

    this.state.saving = true
    this.state.errorMessage = ''
    this.state.successMessage = ''
    
    try {
      const token = this.getToken()
      if (!token) {
        this.redirectToLogin()
        return
      }

      const response = await axios.put<UserProfile>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`,
        {
          username: this.state.username,
          email: this.state.email
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      this.setProfileData(response.data)
      this.state.isEditing = false
      this.showSuccessMessage(SUCCESS_MESSAGES.PROFILE_UPDATED)
    } catch (error: any) {
      this.handleError(error, ERROR_MESSAGES.UPDATE_FAILED)
    } finally {
      this.state.saving = false
    }
  }

  // 編集モードを開始
  startEditing(): void {
    this.state.isEditing = true
    this.state.errorMessage = ''
  }

  // 編集をキャンセル
  cancelEditing(): void {
    this.state.username = this.state.originalUsername
    this.state.email = this.state.originalEmail
    this.state.isEditing = false
    this.state.errorMessage = ''
  }

  // Private Methods

  private setProfileData(data: UserProfile): void {
    this.state.username = data.username
    this.state.email = data.email
    this.state.originalUsername = data.username
    this.state.originalEmail = data.email
  }

  private getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  private redirectToLogin(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    this.router.push('/login')
  }

  private handleError(error: any, defaultMessage: string): void {
    if (error.response?.status === 401) {
      this.redirectToLogin()
    } else {
      this.state.errorMessage = error.response?.data?.detail || defaultMessage
    }
  }

  private showSuccessMessage(message: string, duration: number = 3000): void {
    this.state.successMessage = message
    setTimeout(() => {
      this.state.successMessage = ''
    }, duration)
  }

  // リアクティブな状態をエクスポート
  public getState() {
    return toRefs(this.state)
  }
}

// Composable関数
export function useProfile() {
  const manager = new ProfileManager()
  
  return {
    // 状態
    ...manager.getState(),
    
    // バリデーション
    usernameRules: manager.usernameRules,
    emailRules: manager.emailRules,
    
    // メソッド
    updateProfile: () => manager.updateProfile(),
    startEditing: () => manager.startEditing(),
    cancelEditing: () => manager.cancelEditing(),
    
    // 便利なプロパティ
    hasChanges: manager.hasChanges,
  }
}