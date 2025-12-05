<script setup lang="ts">
import { useLogin } from '@/composables/useAuth'

const {
  // 状態
  email,
  password,
  loading,
  errorMessage,
  
  // バリデーション
  emailRules,
  passwordRules,
  
  // メソッド
  login,
} = useLogin()
</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8">
          <v-card-title class="text-h5 text-center pa-6 bg-primary">
            <v-icon left size="large" class="mr-2">mdi-login</v-icon>
            ログイン
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

            <v-form @submit.prevent="login">
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
                class="mb-4"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                class="mb-4"
              >
                <v-icon start>mdi-login</v-icon>
                ログイン
              </v-btn>
            </v-form>

            <v-divider class="my-4"></v-divider>

            <div class="text-center">
              <p class="text-body-2 mb-2">アカウントをお持ちでない方</p>
              <v-btn
                :to="'/register'"
                variant="outlined"
                color="secondary"
              >
                <v-icon start>mdi-account-plus</v-icon>
                新規登録
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