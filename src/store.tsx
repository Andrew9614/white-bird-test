import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "./api";
import type { AppState, Comment, Post, Reaction, User } from "./types";

type StoreContextType = AppState & {
  loadAll: () => Promise<void>;
  setCurrentUserId: (userId: number | undefined) => void;
  addPost: (post: Omit<Post, "id">) => void;
  updatePostPriority: (postId: number, priority: number) => void;
  deletePost: (postId: number) => void;
  toggleFavorite: (postId: number) => void;
  setReaction: (postId: number, reaction: Reaction | undefined) => void;
  getComments: (postId: number) => Promise<Comment[]>;
  addCommentLocal: (
    postId: number,
    comment: Omit<Comment, "id" | "postId">,
  ) => void;
  updateUser: (user: User) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function useStoredArray(key: string, initial: number[] = []) {
  const [value, setValue] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as number[]) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

function StoreProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsByPostId, setCommentsByPostId] = useState<
    Record<number, Comment[]>
  >({});
  const [reactionsByPostId, setReactionsByPostId] = useState<
    Record<number, Record<number, Reaction>>
  >({});
  const [favoritePostIds, setFavoritePostIds] = useStoredArray(
    "favoritePostIds",
    [],
  );
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const [usersRes, postsRes] = await Promise.all([
        api.getUsers(),
        api.getPosts(),
      ]);
      setUsers(usersRes);
      setPosts(postsRes);
      if (!currentUser && usersRes.length > 0) {
        setCurrentUser(usersRes[0]);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const setCurrentUserId = useCallback(
    (userId: number | undefined) => {
      const user = users.find((u) => u.id === userId);
      setCurrentUser(user);
    },
    [users],
  );

  const addPost = useCallback(async (post: Omit<Post, "id">) => {
    const created = await api.createPost(post);
    const newPost: Post = { ...post, id: created.id ?? Date.now() };
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const deletePost = useCallback(
    async (postId: number) => {
      const ownerId = posts.find((p) => p.id === postId)?.userId;
      if (!currentUser || ownerId !== currentUser.id) return;

      await api.deletePost(postId);

      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setFavoritePostIds((prev) => prev.filter((id) => id !== postId));
    },
    [posts, currentUser, setFavoritePostIds],
  );

  const updatePostPriority = useCallback((postId: number, priority: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, priority } : p)),
    );
  }, []);

  const toggleFavorite = useCallback(
    (postId: number) => {
      setFavoritePostIds((prev) =>
        prev.includes(postId)
          ? prev.filter((id) => id !== postId)
          : [postId, ...prev],
      );
    },
    [setFavoritePostIds],
  );

  const setReaction = useCallback(
    (postId: number, reaction: Reaction | undefined) => {
      setReactionsByPostId((prev) => {
        const userId = currentUser?.id;
        if (!userId) return prev;
        const existing = prev[postId] ?? {};
        const next = { ...existing };
        if (!reaction) {
          delete next[userId];
        } else {
          next[userId] = reaction;
        }
        return { ...prev, [postId]: next };
      });
    },
    [currentUser],
  );

  const getComments = useCallback(
    async (postId: number): Promise<Comment[]> => {
      if (commentsByPostId[postId]) return commentsByPostId[postId];
      const result = await api.getCommentsByPostId(postId);
      setCommentsByPostId((prev) => ({ ...prev, [postId]: result }));
      return result;
    },
    [commentsByPostId],
  );

  const addCommentLocal = useCallback(
    (postId: number, comment: Omit<Comment, "id" | "postId">) => {
      setCommentsByPostId((prev) => ({
        ...prev,
        [postId]: [
          { id: Date.now(), postId, ...comment },
          ...(prev[postId] ?? []),
        ],
      }));
    },
    [],
  );

  const updateUser = useCallback((user: User) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    setCurrentUser((prev) => (prev && prev.id === user.id ? user : prev));
  }, []);

  const value = useMemo<StoreContextType>(
    () => ({
      users,
      posts,
      commentsByPostId,
      reactionsByPostId,
      favoritePostIds,
      currentUser,
      isLoading,
      error,
      loadAll,
      setCurrentUserId,
      addPost,
      updatePostPriority,
      deletePost,
      toggleFavorite,
      setReaction,
      getComments,
      addCommentLocal,
      updateUser,
    }),
    [
      users,
      posts,
      commentsByPostId,
      reactionsByPostId,
      favoritePostIds,
      currentUser,
      isLoading,
      error,
      loadAll,
      setCurrentUserId,
      addPost,
      updatePostPriority,
      deletePost,
      toggleFavorite,
      setReaction,
      getComments,
      addCommentLocal,
      updateUser,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export default StoreProvider;

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
