<script setup lang="ts">
import { useRegister } from '@/composables/useRegister'

const {
  // 状態
  username,
  email,
  password,
  confirmPassword,
  loading,
  errorMessage,
  
  // バリデーション
  usernameRules,
  emailRules,
  passwordRules,
  confirmPasswordRules,
  
  // 便利なプロパティ
  passwordStrength,
  
  // メソッド
  register,
} = useRegister()

// パスワード強度の色を取得
const getStrengthColor = (strength: string) => {
  switch (strength) {
    case 'weak': return 'error'
    case 'medium': return 'warning'
    case 'strong': return 'success'
    default: return 'grey'
  }
}

// パスワード強度のラベルを取得
const getStrengthLabel = (strength: string) => {
  switch (strength) {
    case 'weak': return '弱い'
    case 'medium': return '普通'
    case 'strong': return '強い'
    default: return ''
  }
}
</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card elevation="8">
          <v-card-title class="text-h5 text-center pa-6 bg-secondary">
            <v-icon left size="large" class="mr-2">mdi-account-plus</v-icon>
            新規登録
          </v-card-title>

          <v-card-text class="pa-6">
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              class="mb-4"
            >
              {{ errorMessage }}
            </v-alert>

            <v-form @submit.prevent="register">
              <v-text-field
                v-model="username"
                label="ユーザー名"
                prepend-inner-icon="mdi-account"
                :rules="usernameRules"
                variant="outlined"
                class="mb-4"
                hint="3文字以上、英数字とアンダースコアのみ"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="メールアドレス"
                prepend-inner-icon="mdi-email"
                :rules="emailRules"
                type="email"
                variant="outlined"
                class="mb-4"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="パスワード"
                prepend-inner-icon="mdi-lock"
                :rules="passwordRules"
                type="password"
                variant="outlined"
                class="mb-2"
                hint="8文字以上"
                required
              ></v-text-field>

              <!-- パスワード強度インジケーター -->
              <div v-if="password" class="mb-4">
                <v-chip
                  :color="getStrengthColor(passwordStrength)"
                  size="small"
                  variant="flat"
                >
                  強度: {{ getStrengthLabel(passwordStrength) }}
                </v-chip>
              </div>

              <v-text-field
                v-model="confirmPassword"
                label="パスワード（確認）"
                prepend-inner-icon="mdi-lock-check"
                :rules="confirmPasswordRules"
                type="password"
                variant="outlined"
                class="mb-4"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                color="secondary"
                size="large"
                block
                :loading="loading"
                class="mb-4"
              >
                <v-icon start>mdi-account-plus</v-icon>
                登録
              </v-btn>
            </v-form>

            <v-divider class="my-4"></v-divider>

            <div class="text-center">
              <p class="text-body-2 mb-2">既にアカウントをお持ちの方</p>
              <v-btn
                :to="'/login'"
                variant="outlined"
                color="primary"
              >
                <v-icon start>mdi-login</v-icon>
                ログイン
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fill-height {
  min-height: 80vh;
}
</style>