export type UserAddress = {
  street: string;
  suite?: string;
  city: string;
  zipcode: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  address?: UserAddress;
  isAdmin?: boolean;
};

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
  priority?: number;
};

export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

export type Reaction = "like" | "dislike";

export type AppRoute =
  | { name: "posts" }
  | { name: "post"; postId: number }
  | { name: "users" }
  | { name: "profile" }
  | { name: "admin" }
  | { name: "favorites" };

export type AppState = {
  users: User[];
  posts: Post[];
  commentsByPostId: Record<number, Comment[]>;
  reactionsByPostId: Record<number, Record<number, Reaction>>;
  favoritePostIds: number[];
  currentUser?: User;
  isLoading: boolean;
  error?: string;
};
