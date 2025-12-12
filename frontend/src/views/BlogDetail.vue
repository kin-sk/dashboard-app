<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBlog } from "@/composables/useBlog";

const route = useRoute();
const router = useRouter();
const { post, loading, error, fetchPost, deletePost } = useBlog();

const postId = computed(() => Number(route.params.id));

// 編集ページへ遷移
const goToEdit = () => {
  router.push(`/blog/${postId.value}/edit`);
};

// 記事を削除
const handleDelete = async () => {
  if (confirm("この記事を削除してもよろしいですか？")) {
    const success = await deletePost(postId.value);
    if (success) {
      router.push("/blog");
    }
  }
};

// 一覧へ戻る
const goBack = () => {
  router.push("/blog");
};

// ステータスの色を取得
const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "grey";
    default:
      return "grey";
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

// 日付をフォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchPost(postId.value);
});
</script>

<template>
  <v-container>
    <!-- ローディング -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-linear>

    <!-- エラー -->
    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <!-- 記事詳細 -->
    <div v-else-if="post">
      <!-- ヘッダー -->
      <div class="d-flex justify-space-between align-center mb-4">
        <v-btn variant="text" @click="goBack">
          <v-icon start>mdi-arrow-left</v-icon>
          一覧に戻る
        </v-btn>
        <div>
          <v-btn color="primary" @click="goToEdit" class="mr-2">
            <v-icon start>mdi-pencil</v-icon>
            編集
          </v-btn>
          <v-btn color="error" variant="outlined" @click="handleDelete">
            <v-icon start>mdi-delete</v-icon>
            削除
          </v-btn>
        </div>
      </div>

      <!-- 記事カード -->
      <v-card>
        <!-- アイキャッチ画像 -->
        <v-img
          v-if="post.featured_image"
          :src="post.featured_image"
          height="400"
          cover
        ></v-img>

        <v-card-text class="pa-6">
          <!-- ステータスとカテゴリ -->
          <div class="mb-4">
            <v-chip :color="getStatusColor(post.status)" class="mr-2">
              {{ getStatusLabel(post.status) }}
            </v-chip>
            <v-chip v-if="post.category" color="primary" variant="outlined">
              {{ post.category.name }}
            </v-chip>
          </div>

          <!-- タイトル -->
          <h1 class="text-h3 mb-4">{{ post.title }}</h1>

          <!-- メタ情報 -->
          <div class="d-flex align-center text-grey mb-6">
            <v-icon start>mdi-account</v-icon>
            <span class="mr-4">{{ post.author.username }}</span>
            <v-icon start>mdi-eye</v-icon>
            <span class="mr-4">{{ post.view_count }} views</span>
            <v-icon start>mdi-calendar</v-icon>
            <span>{{ formatDate(post.created_at) }}</span>
          </div>

          <!-- 本文 -->
          <div class="post-content" v-html="post.content"></div>

          <!-- タグ -->
          <v-divider class="my-6"></v-divider>
          <div>
            <v-chip
              v-for="tag in post.tags"
              :key="tag.id"
              class="mr-2 mb-2"
              variant="outlined"
            >
              <v-icon start>mdi-tag</v-icon>
              {{ tag.name }}
            </v-chip>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
.post-content {
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap;
}

.post-content >>> p {
  margin-bottom: 1rem;
}

.post-content >>> h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.post-content >>> h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
</style>
