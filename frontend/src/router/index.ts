import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("../views/Dashboard.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("../views/Profile.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/password-change",
      name: "PasswordChange",
      component: () => import("../views/PasswordChange.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/menu-settings",
      name: "MenuSettings",
      component: () => import("../views/MenuSettings.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// 認証が必要なルートのガード
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("access_token");

  if (to.meta.requiresAuth && !token) {
    // 認証が必要だがトークンがない場合はログインページへ
    next("/login");
  } else if ((to.path === "/login" || to.path === "/register") && token) {
    // すでにログイン済みの場合はダッシュボードへ
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
