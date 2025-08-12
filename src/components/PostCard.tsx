import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { memo, useMemo } from "react";
import type { Post, User } from "../types";
import { useStore } from "../store";
import type { Reaction } from "../types";
import { useNavigate } from "react-router-dom";

function PostCard({
  post,
  author,
  clickable = true,
}: {
  post: Post;
  author?: User;
  clickable?: boolean;
}) {
  const {
    toggleFavorite,
    favoritePostIds,
    setReaction,
    deletePost,
    reactionsByPostId,
  } = useStore();
  const navigate = useNavigate();
  const currentUserId = useStore().currentUser?.id;
  const canDelete = currentUserId === post.userId;
  const isFavorite = useMemo(
    () => favoritePostIds.includes(post.id),
    [favoritePostIds, post.id],
  );
  const userId = useStore().currentUser?.id;
  const currentReaction: Reaction | undefined =
    (userId && reactionsByPostId[post.id]?.[userId]) || undefined;
  const likeCount = Object.values(reactionsByPostId[post.id] ?? {}).filter(
    (r) => r === "like",
  ).length;
  const dislikeCount = Object.values(reactionsByPostId[post.id] ?? {}).filter(
    (r) => r === "dislike",
  ).length;

  return (
    <Card
      variant="outlined"
      sx={{ cursor: clickable ? "pointer" : "default" }}
      onClick={() => clickable && navigate(`/post/${post.id}`)}
    >
      <CardContent>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">{post.title}</Typography>
          {typeof post.priority === "number" && (
            <Chip
              color="warning"
              size="small"
              icon={<StarIcon />}
              label={`Priority ${post.priority}`}
            />
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {post.body}
        </Typography>
        {author && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            by {author.name}
          </Typography>
        )}
      </CardContent>
      <CardActions onClick={(e) => e.stopPropagation()}>
        <Tooltip
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <IconButton
            onClick={() => toggleFavorite(post.id)}
            color={isFavorite ? "error" : "default"}
          >
            <FavoriteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Like">
          <IconButton
            onClick={() =>
              setReaction(
                post.id,
                currentReaction === "like" ? undefined : "like",
              )
            }
            color={currentReaction === "like" ? "primary" : "default"}
          >
            <ThumbUpIcon fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {likeCount}
            </Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="Dislike">
          <IconButton
            onClick={() =>
              setReaction(
                post.id,
                currentReaction === "dislike" ? undefined : "dislike",
              )
            }
            color={currentReaction === "dislike" ? "primary" : "default"}
          >
            <ThumbDownIcon fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {dislikeCount}
            </Typography>
          </IconButton>
        </Tooltip>
        {canDelete && (
          <Tooltip title="Delete post">
            <IconButton onClick={() => deletePost(post.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
}

export default memo(PostCard);
