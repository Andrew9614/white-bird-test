import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { useStore } from "../store";
import PostCard from "../components/PostCard";

export default function PostDetailsPage({ postId }: { postId: number }) {
  const { posts, users, getComments, addCommentLocal } = useStore();
  const post = useMemo(
    () => posts.find((p) => p.id === postId),
    [posts, postId],
  );
  const author = useMemo(
    () => users.find((u) => u.id === post?.userId),
    [users, post],
  );
  const [comments, setComments] = useState(
    () => [] as Awaited<ReturnType<typeof getComments>>,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getComments(postId);
      if (!cancelled) setComments(res);
    })();
    return () => {
      cancelled = true;
    };
  }, [getComments, postId]);

  if (!post) return <Typography>Post not found</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <PostCard post={post} author={author} clickable={false} />
      </Box>

      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Comment"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          multiline
          minRows={3}
        />
        <Button
          variant="contained"
          disabled={!name || !email || !body}
          onClick={() => {
            addCommentLocal(postId, { name, email, body });
            setComments((prev) => [
              { id: Date.now(), postId, name, email, body },
              ...prev,
            ]);
            setName("");
            setEmail("");
            setBody("");
          }}
        >
          Add comment
        </Button>
      </Stack>

      <Stack spacing={2}>
        {comments.map((c) => (
          <Paper key={c.id} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2">{c.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {c.email}
            </Typography>
            <Typography sx={{ mt: 1 }}>{c.body}</Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
