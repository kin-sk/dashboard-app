<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '@/constants/api'
import { VALIDATION_SETS } from '@/constants/validation'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants/messages'

const router = useRouter()

// フォームデータ
const username = ref('')
const email = ref('')
const originalUsername = ref('')
const originalEmail = ref('')

// 状態管理
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isEditing = ref(false)

// バリデーションルール（定数から取得）
const usernameRules = VALIDATION_SETS.username
const emailRules = VALIDATION_SETS.email

// ユーザー情報を取得
const fetchUserProfile = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    username.value = response.data.username
    email.value = response.data.email
    originalUsername.value = response.data.username
    originalEmail.value = response.data.email
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      router.push('/login')
    } else {
      errorMessage.value = ERROR_MESSAGES.FETCH_FAILED
    }
  } finally {
    loading.value = false
  }
}

// プロフィールを更新
const updateProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  saving.value = true
  
  try {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`,
      {
        username: username.value,
        email: email.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    successMessage.value = SUCCESS_MESSAGES.PROFILE_UPDATED
    originalUsername.value = response.data.username
    originalEmail.value = response.data.email
    isEditing.value = false
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      router.push('/login')
    } else {
      errorMessage.value = error.response?.data?.detail || ERROR_MESSAGES.UPDATE_FAILED
    }
  } finally {
    saving.value = false
  }
}

// 編集をキャンセル
const cancelEdit = () => {
  username.value = originalUsername.value
  email.value = originalEmail.value
  isEditing.value = false
  errorMessage.value = ''
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<template>
  <!-- 以前と同じHTMLテンプレート -->
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title class="text-h5 pa-4">
            <v-icon left>mdi-account</v-icon>
            プロフィール
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <v-progress-linear
              v-if="loading"
              indeterminate
              color="primary"
            ></v-progress-linear>

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              class="mb-4"
            >
              {{ errorMessage }}
            </v-alert>

            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              closable
              class="mb-4"
            >
              {{ successMessage }}
            </v-alert>

            <v-form v-if="!loading">
              <v-text-field
                v-model="username"
                label="ユーザー名"
                prepend-icon="mdi-account"
                :rules="usernameRules"
                :readonly="!isEditing"
                variant="outlined"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="メールアドレス"
                prepend-icon="mdi-email"
                :rules="emailRules"
                :readonly="!isEditing"
                variant="outlined"
                type="email"
                class="mb-4"
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>

            <template v-if="!isEditing">
              <v-btn
                color="primary"
                variant="elevated"
                @click="isEditing = true"
              >
                <v-icon start>mdi-pencil</v-icon>
                編集
              </v-btn>
            </template>

            <template v-else>
              <v-btn
                variant="text"
                @click="cancelEdit"
                :disabled="saving"
              >
                キャンセル
              </v-btn>
              
              <v-btn
                color="primary"
                variant="elevated"
                @click="updateProfile"
                :loading="saving"
              >
                <v-icon start>mdi-content-save</v-icon>
                保存
              </v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>