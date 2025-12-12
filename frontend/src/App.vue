<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useMenu } from "@/composables/useMenu";

const router = useRouter();
const isLoggedIn = ref(false);
const rail = ref(true); // レール状態（アイコンのみ表示）
const permanent = ref(true); // 常時表示

// メニュー管理
const { visibleItems } = useMenu();

const checkAuth = () => {
  const token = localStorage.getItem("access_token");
  isLoggedIn.value = !!token;
};

const handleLogout = () => {
  localStorage.removeItem("access_token");
  isLoggedIn.value = false;
  router.push("/login");
};

// メニューアイテムをクリック
const handleMenuClick = (item: any) => {
  if (item.type === "external") {
    // 外部リンク
    window.open(item.url, item.target);
  } else {
    // 内部リンク
    if (item.target === "_blank") {
      // 新しいタブで開く
      window.open(item.url, "_blank");
    } else {
      // 同じ画面で遷移
      router.push(item.url);
    }
  }
};

// ナビゲーションアイコンをクリック（レール状態の切り替え）
const toggleRail = () => {
  rail.value = !rail.value;
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
        :icon="rail ? 'mdi-menu' : 'mdi-menu-open'"
        @click="toggleRail"
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
    <v-navigation-drawer
      v-if="isLoggedIn"
      v-model="permanent"
      expand-on-hover
      :rail="rail"
      permanent
    >
      <v-list>
        <!-- 動的メニュー -->
        <v-list-item
          v-for="item in visibleItems"
          :key="item.id"
          :prepend-icon="item.icon"
          :title="item.label"
          @click="handleMenuClick(item)"
        >
          <template v-if="item.type === 'external'" #append>
            <v-icon size="small">mdi-open-in-new</v-icon>
          </template>
        </v-list-item>
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
