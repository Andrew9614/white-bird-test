import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import PostCard from "../components/PostCard";
import { useStore } from "../store";

export default function FavoritesPage() {
  const { posts, users, favoritePostIds } = useStore();
  const favorites = useMemo(
    () => posts.filter((p) => favoritePostIds.includes(p.id)),
    [posts, favoritePostIds],
  );
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Favorites
      </Typography>
      <Stack spacing={2}>
        {favorites.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            author={users.find((u) => u.id === post.userId)}
          />
        ))}
      </Stack>
    </Box>
  );
}
