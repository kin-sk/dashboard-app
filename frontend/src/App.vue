<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const isLoggedIn = ref(false)

const checkAuth = () => {
  const token = localStorage.getItem('access_token')
  isLoggedIn.value = !!token
}

const handleLogout = () => {
  localStorage.removeItem('access_token')
  isLoggedIn.value = false
  router.push('/login')
}

onMounted(() => {
  checkAuth()
  // ルート変更時にも認証状態を確認
  router.afterEach(() => {
    checkAuth()
  })
})
</script>

<template>
  <div id="app">
    <header>
      <nav>
        <div class="nav-links">
          <RouterLink to="/">ホーム</RouterLink>
          <RouterLink v-if="isLoggedIn" to="/dashboard">ダッシュボード</RouterLink>
        </div>
        <div class="auth-links">
          <template v-if="!isLoggedIn">
            <RouterLink to="/login">ログイン</RouterLink>
            <RouterLink to="/register" class="register-btn">新規登録</RouterLink>
          </template>
          <button v-else @click="handleLogout" class="logout-btn">ログアウト</button>
        </div>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
header {
  background-color: #2c3e50;
  padding: 1rem;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-links, .auth-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #34495e;
}

nav a.router-link-active {
  background-color: #42b983;
}

.register-btn {
  background-color: #667eea !important;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c0392b;
}

main {
  padding: 2rem;
}
</style>