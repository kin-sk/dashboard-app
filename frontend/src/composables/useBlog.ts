import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from "@/constants/api";
import type {
  Post,
  PostListItem,
  Category,
  Tag,
  PostCreateData,
} from "@/types/blog";

class BlogManager {
  private posts = ref<PostListItem[]>([]);
  private currentPost = ref<Post | null>(null);
  private categories = ref<Category[]>([]);
  private tags = ref<Tag[]>([]);
  private loading = ref(false);
  private error = ref("");

  private router = useRouter();

  // Getters
  get allPosts() {
    return computed(() => this.posts.value);
  }
  get post() {
    return computed(() => this.currentPost.value);
  }
  get allCategories() {
    return computed(() => this.categories.value);
  }
  get allTags() {
    return computed(() => this.tags.value);
  }
  get isLoading() {
    return computed(() => this.loading.value);
  }
  get errorMessage() {
    return computed(() => this.error.value);
  }

  // 記事一覧を取得
  async fetchPosts(params?: {
    status?: string;
    category_id?: number;
    tag_id?: number;
    limit?: number;
    offset?: number;
  }): Promise<void> {
    this.loading.value = true;
    this.error.value = "";

    try {
      const response = await axios.get<PostListItem[]>(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG.POSTS}`,
        { params }
      );
      this.posts.value = response.data;
    } catch (err: any) {
      this.error.value =
        err.response?.data?.detail || "記事の取得に失敗しました";
    } finally {
      this.loading.value = false;
    }
  }

  // 記事詳細を取得
  async fetchPost(id: number): Promise<void> {
    this.loading.value = true;
    this.error.value = "";

    try {
      const response = await axios.get<Post>(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG.POST_DETAIL(id)}`
      );
      this.currentPost.value = response.data;
    } catch (err: any) {
      this.error.value =
        err.response?.data?.detail || "記事の取得に失敗しました";
      if (err.response?.status === 404) {
        this.router.push("/blog");
      }
    } finally {
      this.loading.value = false;
    }
  }

  // 記事を作成
  async createPost(data: PostCreateData): Promise<Post | null> {
    this.loading.value = true;
    this.error.value = "";

    try {
      const token = this.getToken();
      if (!token) {
        this.redirectToLogin();
        return null;
      }

      const response = await axios.post<Post>(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG.POSTS}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (err: any) {
      this.error.value =
        err.response?.data?.detail || "記事の作成に失敗しました";
      return null;
    } finally {
      this.loading.value = false;
    }
  }

  // 記事を更新
  async updatePost(
    id: number,
    data: Partial<PostCreateData>
  ): Promise<Post | null> {
    this.loading.value = true;
    this.error.value = "";

    try {
      const token = this.getToken();
      if (!token) {
        this.redirectToLogin();
        return null;
      }

      const response = await axios.put<Post>(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG.POST_DETAIL(id)}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (err: any) {
      this.error.value =
        err.response?.data?.detail || "記事の更新に失敗しました";
      return null;
    } finally {
      this.loading.value = false;
    }
  }

  // 記事を削除
  async deletePost(id: number): Promise<boolean> {
    this.loading.value = true;
    this.error.value = "";

    try {
      const token = this.getToken();
      if (!token) {
        this.redirectToLogin();
        return false;
      }

      await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG.POST_DETAIL(id)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return true;
    } catch (err: any) {
      this.error.value =
        err.response?.data?.detail || "記事の削除に失敗しました";
      return false;
    } finally {
      this.loading.value = false;
    }
  }

  // カテゴリ一覧を取得
  async fetchCategories(): Promise<void> {
    try {
      const response = await axios.get<Category[]>(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG.CATEGORIES}`
      );
      this.categories.value = response.data;
    } catch (err: any) {
      console.error("カテゴリの取得に失敗:", err);
    }
  }

  // タグ一覧を取得
  async fetchTags(): Promise<void> {
    try {
      const response = await axios.get<Tag[]>(
        `${API_BASE_URL}${API_ENDPOINTS.BLOG.TAGS}`
      );
      this.tags.value = response.data;
    } catch (err: any) {
      console.error("タグの取得に失敗:", err);
    }
  }

  // Private methods
  private getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private redirectToLogin(): void {
    this.router.push("/login");
  }
}

// シングルトンインスタンス
let blogManager: BlogManager | null = null;

export function useBlog() {
  if (!blogManager) {
    blogManager = new BlogManager();
  }

  return {
    // 状態
    posts: blogManager.allPosts,
    post: blogManager.post,
    categories: blogManager.allCategories,
    tags: blogManager.allTags,
    loading: blogManager.isLoading,
    error: blogManager.errorMessage,

    // メソッド
    fetchPosts: (params?: any) => blogManager!.fetchPosts(params),
    fetchPost: (id: number) => blogManager!.fetchPost(id),
    createPost: (data: PostCreateData) => blogManager!.createPost(data),
    updatePost: (id: number, data: Partial<PostCreateData>) =>
      blogManager!.updatePost(id, data),
    deletePost: (id: number) => blogManager!.deletePost(id),
    fetchCategories: () => blogManager!.fetchCategories(),
    fetchTags: () => blogManager!.fetchTags(),
  };
}
