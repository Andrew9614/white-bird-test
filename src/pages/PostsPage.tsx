import {
  useMemo,
  useState,
  useRef,
  memo,
  type FC,
  useCallback,
  useEffect,
} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CreatePostDialog, {
  type CreatePostDialogHandle,
} from "../components/CreatePostDialog";
import PostCard from "../components/PostCard";
import type { Post, User } from "../types";
import { useStore } from "../store";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";

type PostListProps = { posts: Post[]; users: User[] };

const SPACING_PX = 16;

const VirtualizedPostList: FC<PostListProps> = memo(
  function VirtualizedPostList({ posts, users }) {
    const listRef = useRef<List>(null);
    const sizeCacheRef = useRef<Record<number, number>>({});

    useEffect(() => {
      sizeCacheRef.current = {};
      listRef.current?.resetAfterIndex(0, true);
    }, [posts]);

    const getItemSize = useCallback((index: number) => {
      return sizeCacheRef.current[index] ?? 200;
    }, []);

    const setSize = useCallback((index: number, size: number) => {
      const cached = sizeCacheRef.current[index];
      if (!cached || Math.abs(cached - size) > 1) {
        sizeCacheRef.current[index] = size;
        listRef.current?.resetAfterIndex(index);
      }
    }, []);

    const Row: FC<{ index: number; style: React.CSSProperties }> = ({
      index,
      style,
    }) => {
      const post = posts[index];
      const author = users.find((u) => u.id === post.userId);

      const measureRef = useCallback(
        (node: HTMLDivElement | null) => {
          if (node) {
            const measured = node.getBoundingClientRect().height;
            setSize(index, measured + SPACING_PX);
          }
        },
        [index],
      );

      return (
        <div style={style}>
          <div ref={measureRef}>
            <Box sx={{ mb: `${SPACING_PX}px` }}>
              <PostCard post={post} author={author} />
            </Box>
          </div>
        </div>
      );
    };

    return (
      <Box sx={{ height: "70vh" }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              width={width}
              itemCount={posts.length}
              itemSize={getItemSize}
              estimatedItemSize={220}
            >
              {({
                index,
                style,
              }: {
                index: number;
                style: React.CSSProperties;
              }) => <Row index={index} style={style} />}
            </List>
          )}
        </AutoSizer>
      </Box>
    );
  },
);

export default function PostsPage() {
  const { posts, users, isLoading } = useStore();
  const [selectedUserId, setSelectedUserId] = useState<number | "all">("all");
  const dialogRef = useRef<CreatePostDialogHandle>(null);

  const filteredPosts = useMemo(() => {
    const list =
      selectedUserId === "all"
        ? posts
        : posts.filter((p) => p.userId === selectedUserId);
    return [...list].sort(
      (a, b) => (b.priority ?? -1) - (a.priority ?? -1) || b.id - a.id,
    );
  }, [posts, selectedUserId]);

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">All Posts</Typography>
          <Button
            variant="contained"
            onClick={() => dialogRef.current?.open()}
            disabled={isLoading || users.length === 0}
          >
            New Post
          </Button>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            select
            label="Filter by user"
            value={selectedUserId}
            onChange={(e) =>
              setSelectedUserId(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="all">All</MenuItem>
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Stack>

      <VirtualizedPostList posts={filteredPosts} users={users} />

      <CreatePostDialog ref={dialogRef} />
    </Box>
  );
}
