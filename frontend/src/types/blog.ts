export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface Author {
  id: number;
  username: string;
  email: string;
}

export interface Post {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  status: string | "published" | "atchived";
  published_at?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  author: Author;
  category?: Category;
  tags: Tag[];
}

export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  status: "draft" | "published" | "archived";
  published_at?: string;
  view_count: number;
  created_at: string;
  author: Author;
  category?: Category;
  tags: Tag[];
}

export interface PostCreateData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: "draft" | "published" | "archived";
  ategory_id?: number;
  tag_ids: number[];
}
