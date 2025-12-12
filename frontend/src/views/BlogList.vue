<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useBlog } from "@/composables/useBlog";
import type { PostListItem } from "@/types/blog";

const router = useRouter();
const {
  posts,
  categories,
  tags,
  loading,
  fetchPosts,
  fetchCategories,
  fetchTags,
} = useBlog();

// フィルター
const selectedStatus = ref<string>("");
const selectedCategory = ref<number | undefined>(undefined);
const selectedTag = ref<number | undefined>(undefined);

// ステータスオプション
const statusOptions = [
  { title: "すべて", value: "" },
  { title: "公開済み", value: "published" },
  { title: "下書き", value: "draft" },
  { title: "アーカイブ", valur: "archived" },
];

// 記事詳細ページへ遷移
const goToDetail = (post: PostListItem) => {
  router.push("/blog/${post.id}");
};

// 新規作成ページへ遷移
const goToCreate = () => {
  router.push("/blog/create");
};

// フィルターを適用
const applyFilter = () => {
  fetchPosts({
    status: selectedStatus.value || undefined,
    category: selectedCategory.value,
    tag_id: selectedTag.value,
  });
};

// フィルターをリセット
const resetFilter = () => {
  (selectedStatus.value = ""),
    (selectedCategory.value = undefined),
    (selectedTag.value = undefined),
    fetchPosts();
};

// ステータスの色を取得
const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "gray";
    default:
      return "gray";
  }
};

// ステータスのラベルを取得
const getStatusLabel = (status: string) => {
  switch (status) {
    case "published":
      return "公開済み";
    case "draft":
      return "下書き";
    case "archived":
      return "アーカイブ";
    default:
      return status;
  }
};

//日付をフォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  fetchPosts();
  fetchCategories();
  fetchTags();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- ヘッダー -->
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">
            <v-icon left>mdi-post</v-icon>
            ブログ記事
          </h1>
          <v-btn color="primary" @click="goToCreate">
            <v-icon left>mdi-plus</v-icon>
            新規登録
          </v-btn>
        </div>

        <!-- フィルター -->
        <v-card class="mb-4">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedStatus"
                  :items="statusOptions"
                  label="ステータス"
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedCategory"
                  :items="categories"
                  item-title="name"
                  item-value="id"
                  label="カテゴリ"
                  variant="outlined"
                  density="compact"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedTag"
                  :items="tags"
                  item-title="name"
                  item-value="id"
                  label="タグ"
                  variant="outlined"
                  density="compact"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-center">
                <v-btn color="primary" @click="applyFilter" class="mr-2">
                  <v-icon start>mdi-filter</v-icon>
                  フィルター
                </v-btn>
                <v-btn variant="outlined" @click="resetFilter">
                  <v-icon start>mdi-refresh</v-icon>
                  リセット
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ローディング -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
        ></v-progress-linear>

        <!-- 記事一覧 -->
        <v-row v-else>
          <v-col v-if="posts.length === 0" cols="12">
            <v-alert type="info" variant="tonal"> 記事がありません </v-alert>
          </v-col>

          <v-col v-for="post in posts" :key="post.id" cols="12" md="6" lg="4">
            <v-card hover @click="goToDetail(post)" class="h-100">
              <!-- アイキャッチ画像 -->
              <v-img
                v-if="post.featured_image"
                :src="post.featured_image"
                height="200"
                cover
              ></v-img>
              <v-img
                v-else
                src="https://via.placeholder.com/400x200?text=No+Image"
                height="200"
                cover
              ></v-img>

              <v-card-title>{{ post.title }}</v-card-title>

              <v-card-subtitle>
                <v-chip
                  :color="getStatusColor(post.status)"
                  size="small"
                  class="mr-2"
                >
                  {{ getStatusLabel(post.status) }}
                </v-chip>
                <span v-if="post.category">{{ post.category.name }}</span>
              </v-card-subtitle>

              <v-card-text>
                <p class="text-truncate-3">{{ post.excerpt }}</p>

                <!-- タグ -->
                <div class="mt-2">
                  <v-chip
                    v-for="tag in post.tags"
                    :key="tag.id"
                    size="small"
                    class="mr-1 mb-1"
                    variant="outlined"
                  >
                    {{ tag.name }}
                  </v-chip>
                </div>

                <!-- メタ情報 -->
                <div class="mt-3 text-caption text-grey">
                  <v-icon size="small">mdi-account</v-icon>
                  {{ post.author.username }}
                  <span class="mx-2">|</span>
                  <v-icon size="small">mdi-eye</v-icon>
                  {{ post.view_count }}
                  <span class="mx-2">|</span>
                  <v-icon size="small">mdi-calendar</v-icon>
                  {{ formatDate(post.created_at) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
