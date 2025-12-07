<script setup lang="ts">
import { usePasswordChange } from "@/composables/usePasswordChange";

const {
  // 状態
  currentPassword,
  newPassword,
  confirmPassword,
  loading,
  errorMessage,
  successMessage,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,

  // バリデーション
  currentPasswordRules,
  newPasswordRules,
  confirmPasswordRules,

  // 便利なプロパティ
  passwordStrength,

  // メソッド
  changePassword,
} = usePasswordChange();

// パスワード強度の色を取得
const getStrengthColor = (strength: string) => {
  switch (strength) {
    case "weak":
      return "error";
    case "medium":
      return "warning";
    case "strong":
      return "success";
    default:
      return "grey";
  }
};

// パスワード強度のラベルを取得
const getStrengthLabel = (strength: string) => {
  switch (strength) {
    case "weak":
      return "弱い";
    case "medium":
      return "普通";
    case "strong":
      return "強い";
    default:
      return "";
  }
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title class="text-h5 pa-4">
            <v-icon left>mdi-lock-reset</v-icon>
            パスワード変更
          </v-card-title>

          <v-divider></v-divider>

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

            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              closable
              class="mb-4"
            >
              {{ successMessage }}
            </v-alert>

            <v-form @submit.prevent="changePassword">
              <!-- 現在のパスワード -->
              <v-text-field
                v-model="currentPassword"
                label="現在のパスワード"
                prepend-icon="mdi-lock"
                :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showCurrentPassword ? 'text' : 'password'"
                :rules="currentPasswordRules"
                variant="outlined"
                class="mb-4"
                @click:append="showCurrentPassword = !showCurrentPassword"
                required
              ></v-text-field>

              <!-- 新しいパスワード -->
              <v-text-field
                v-model="newPassword"
                label="新しいパスワード"
                prepend-icon="mdi-lock-plus"
                :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showNewPassword ? 'text' : 'password'"
                :rules="newPasswordRules"
                variant="outlined"
                class="mb-2"
                hint="8文字以上"
                @click:append="showNewPassword = !showNewPassword"
                required
              ></v-text-field>

              <!-- パスワード強度インジケーター -->
              <div v-if="newPassword" class="mb-4">
                <v-chip
                  :color="getStrengthColor(passwordStrength)"
                  size="small"
                  variant="flat"
                >
                  強度: {{ getStrengthLabel(passwordStrength) }}
                </v-chip>
              </div>

              <!-- 新しいパスワード（確認） -->
              <v-text-field
                v-model="confirmPassword"
                label="新しいパスワード（確認）"
                prepend-icon="mdi-lock-check"
                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showConfirmPassword ? 'text' : 'password'"
                :rules="confirmPasswordRules"
                variant="outlined"
                class="mb-4"
                @click:append="showConfirmPassword = !showConfirmPassword"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
              >
                <v-icon start>mdi-content-save</v-icon>
                パスワードを変更
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
