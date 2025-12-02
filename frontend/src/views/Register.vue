<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  errorMessage.value = ''

  // パスワード確認
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'パスワードが一致しません'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'パスワードは6文字以上で入力してください'
    return
  }

  isLoading.value = true

  try {
    await axios.post('http://localhost:8000/api/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value
    })

    // 登録成功後、ログインページへ
    alert('登録が完了しました！ログインしてください。')
    router.push('/login')
  } catch (error: any) {
    if (error.response) {
      errorMessage.value = error.response.data.detail || '登録に失敗しました'
    } else {
      errorMessage.value = 'サーバーに接続できません'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1>新規登録</h1>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">ユーザー名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="ユーザー名"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">メールアドレス</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="example@example.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">パスワード</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="パスワード（6文字以上）"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">パスワード（確認）</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="パスワード（確認）"
            required
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoading" class="register-button">
          {{ isLoading ? '登録中...' : '登録' }}
        </button>
      </form>

      <div class="login-link">
        <p>既にアカウントをお持ちの方は <RouterLink to="/login">ログイン</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.register-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  background: #ffe0e0;
  color: #d63031;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
}

.register-button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #7f8c8d;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>