<script setup lang="ts">
import { useProfile } from '@/composables/useProfile'

// クラスベースのロジックを使用
const {
  // 状態
  username,
  email,
  loading,
  saving,
  isEditing,
  errorMessage,
  successMessage,
  
  // バリデーション
  usernameRules,
  emailRules,
  
  // メソッド
  updateProfile,
  startEditing,
  cancelEditing,
} = useProfile()
</script>

<template>
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
                @click="startEditing"
              >
                <v-icon start>mdi-pencil</v-icon>
                編集
              </v-btn>
            </template>

            <template v-else>
              <v-btn
                variant="text"
                @click="cancelEditing"
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