import { reactive, toRefs, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from "@/constants/api";
import { VALIDATION_RULES } from "@/constants/validation";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";

class PasswordChangeManager {
  private state = reactive({
    // フォームデータ
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // UI状態
    loading: false,
    errorMessage: "",
    successMessage: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  private router = useRouter();

  constructor() {}

  // Getters
  get currentPassword() {
    return this.state.currentPassword;
  }
  get newPassword() {
    return this.state.newPassword;
  }
  get confirmPassword() {
    return this.state.confirmPassword;
  }
  get loading() {
    return this.state.loading;
  }
  get errorMessage() {
    return this.state.errorMessage;
  }
  get successMessage() {
    return this.state.successMessage;
  }
  get showCurrentPassword() {
    return this.state.showCurrentPassword;
  }
  get showNewPassword() {
    return this.state.showNewPassword;
  }
  get showConfirmPassword() {
    return this.state.showConfirmPassword;
  }

  // Setters
  set currentPassword(value: string) {
    this.state.currentPassword = value;
  }
  set newPassword(value: string) {
    this.state.newPassword = value;
  }
  set confirmPassword(value: string) {
    this.state.confirmPassword = value;
  }
  set showCurrentPassword(value: boolean) {
    this.state.showCurrentPassword = value;
  }
  set showNewPassword(value: boolean) {
    this.state.showNewPassword = value;
  }
  set showConfirmPassword(value: boolean) {
    this.state.showConfirmPassword = value;
  }

  // バリデーションルール
  public readonly currentPasswordRules = [
    VALIDATION_RULES.required("現在のパスワード"),
  ];

  public readonly newPasswordRules = [
    VALIDATION_RULES.required("新しいパスワード"),
    VALIDATION_RULES.password,
  ];

  get confirmPasswordRules() {
    return [
      VALIDATION_RULES.required("パスワード（確認）"),
      VALIDATION_RULES.confirmPassword(this.state.newPassword),
    ];
  }

  // パスワードの強度チェック
  get passwordStrength(): "weak" | "medium" | "strong" {
    const password = this.state.newPassword;
    if (password.length < 8) return "weak";

    let strength = 0;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return "weak";
    if (strength === 3) return "medium";
    return "strong";
  }

  // パスワード変更処理
  async changePassword(): Promise<void> {
    // バリデーション
    if (this.state.newPassword !== this.state.confirmPassword) {
      this.state.errorMessage = ERROR_MESSAGES.PASSWORD_MISMATCH;
      return;
    }

    this.state.loading = true;
    this.state.errorMessage = "";
    this.state.successMessage = "";

    try {
      const token = this.getToken();
      if (!token) {
        this.redirectToLogin();
        return;
      }

      await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.CHANGE_PASSWORD}`,
        {
          current_password: this.state.currentPassword,
          new_password: this.state.newPassword,
          confirm_password: this.state.confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      this.showSuccessMessage(SUCCESS_MESSAGES.PASSWORD_CHANGED);
      this.reset();
    } catch (error: any) {
      this.handleError(error);
    } finally {
      this.state.loading = false;
    }
  }

  // Private Methods

  private getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private redirectToLogin(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.router.push("/login");
  }

  private handleError(error: any): void {
    if (error.response?.status === 401) {
      this.redirectToLogin();
    } else if (error.response?.status === 400) {
      this.state.errorMessage =
        error.response.data.detail || ERROR_MESSAGES.CURRENT_PASSWORD_INCORRECT;
    } else {
      this.state.errorMessage =
        error.response?.data?.detail || ERROR_MESSAGES.UPDATE_FAILED;
    }
  }

  private showSuccessMessage(message: string, duration: number = 3000): void {
    this.state.successMessage = message;
    setTimeout(() => {
      this.state.successMessage = "";
    }, duration);
  }

  // フォームをリセット
  reset(): void {
    this.state.currentPassword = "";
    this.state.newPassword = "";
    this.state.confirmPassword = "";
    this.state.errorMessage = "";
  }

  // リアクティブな状態をエクスポート
  public getState() {
    return toRefs(this.state);
  }
}

// Composable関数
export function usePasswordChange() {
  const manager = new PasswordChangeManager();

  return {
    // 状態
    ...manager.getState(),

    // バリデーション
    currentPasswordRules: manager.currentPasswordRules,
    newPasswordRules: manager.newPasswordRules,
    confirmPasswordRules: computed(() => manager.confirmPasswordRules),

    // 便利なプロパティ
    passwordStrength: computed(() => manager.passwordStrength),

    // メソッド
    changePassword: () => manager.changePassword(),
    reset: () => manager.reset(),
  };
}
