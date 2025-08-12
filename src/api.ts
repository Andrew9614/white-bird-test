import type { Comment, Post, User } from "./types";

const BASE_URL = "https://jsonplaceholder.typicode.com";

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${path}`);
  }
  return (await response.json()) as T;
}

export default {
  async getUsers(): Promise<User[]> {
    const users = await http<User[]>("/users");
    const minId = Math.min(...users.map((u) => u.id));
    return users.map((u) => ({ ...u, isAdmin: u.id === minId }));
  },
  async getPosts(): Promise<Post[]> {
    return http<Post[]>("/posts");
  },
  async createPost(post: Omit<Post, "id">): Promise<Post> {
    return http<Post>("/posts", {
      method: "POST",
      body: JSON.stringify(post),
    });
  },
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return http<Comment[]>(`/posts/${postId}/comments`);
  },
  async createComment(postId: number, comment: Omit<Comment, "id" | "postId">): Promise<Comment> {
    return http<Comment>(`/comments`, {
      method: "POST",
      body: JSON.stringify({ ...comment, postId }),
    });
  },
  async deletePost(postId: number): Promise<void> {
    await http<void>(`/posts/${postId}`, { method: "DELETE" });
  },
  async updateUser(user: User): Promise<User> {
    return http<User>(`/users/${user.id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  },
};
