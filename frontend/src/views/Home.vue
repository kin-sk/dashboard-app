<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiStatus = ref<string>('確認中...')
const apiMessage = ref<string>('')

const checkApiHealth = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/health')
    apiStatus.value = 'APIは正常に動作しています'
    apiMessage.value = JSON.stringify(response.data, null, 2)
  } catch (error) {
    apiStatus.value = 'APIに接続できません'
    apiMessage.value = error instanceof Error ? error.message : 'Unknown error'
  }
}

onMounted(() => {
  checkApiHealth()
})
</script>

<template>
  <div class="home">
    <h1>Dashboard App へようこそ</h1>
    <div class="status-card">
      <h2>API ステータス</h2>
      <p>{{ apiStatus }}</p>
      <pre v-if="apiMessage">{{ apiMessage }}</pre>
      <button @click="checkApiHealth">再確認</button>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.status-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
  margin-top: 0;
  color: #34495e;
}

pre {
  background: #fff;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

button {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background: #369970;
}
</style>