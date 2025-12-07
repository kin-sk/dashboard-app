<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();
const isLoggedIn = ref(false);
const drawer = ref(false);

const checkAuth = () => {
  const token = localStorage.getItem("access_token");
  isLoggedIn.value = !!token;
};

const handleLogout = () => {
  localStorage.removeItem("access_token");
  isLoggedIn.value = false;
  router.push("/login");
};

onMounted(() => {
  checkAuth();
  router.afterEach(() => {
    checkAuth();
  });
});
</script>

<template>
  <v-app>
    <!-- ナビゲーションバー -->
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon
        v-if="isLoggedIn"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Dashboard App</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- 未ログイン時のメニュー -->
      <template v-if="!isLoggedIn">
        <v-btn :to="'/login'" variant="text">
          <v-icon start>mdi-login</v-icon>
          ログイン
        </v-btn>
        <v-btn :to="'/register'" variant="tonal">
          <v-icon start>mdi-account-plus</v-icon>
          新規登録
        </v-btn>
      </template>

      <!-- ログイン時のメニュー -->
      <template v-else>
        <v-btn @click="handleLogout" variant="text">
          <v-icon start>mdi-logout</v-icon>
          ログアウト
        </v-btn>
      </template>
    </v-app-bar>

    <!-- サイドナビゲーション（ログイン時のみ） -->
    <v-navigation-drawer v-if="isLoggedIn" v-model="drawer" temporary>
      <v-list>
        <v-list-item
          prepend-icon="mdi-home"
          title="ホーム"
          :to="'/'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="ダッシュボード"
          :to="'/dashboard'"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item
          prepend-icon="mdi-account"
          title="プロフィール"
          :to="'/profile'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-lock-reset"
          title="パスワード変更"
          :to="'/password-change'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cog"
          title="設定"
          value="settings"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- メインコンテンツ -->
    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
