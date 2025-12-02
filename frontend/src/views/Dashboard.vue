<script setup lang="ts">
import { ref } from 'vue'

const dashboardData = ref({
  title: 'ダッシュボード',
  stats: [
    { label: 'ユーザー数', value: 150 },
    { label: 'アクティブセッション', value: 45 },
    { label: '今月の訪問数', value: 2340 }
  ]
})
</script>

<template>
  <div class="dashboard">
    <h1>{{ dashboardData.title }}</h1>
    <div class="stats-grid">
      <div v-for="stat in dashboardData.stats" :key="stat.label" class="stat-card">
        <h3>{{ stat.label }}</h3>
        <p class="stat-value">{{ stat.value }}</p>
      </div>
    </div>
    <div class="content-area">
      <p>ここにダッシュボードのコンテンツを追加していきます。</p>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.content-area {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>