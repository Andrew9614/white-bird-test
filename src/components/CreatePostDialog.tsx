import { forwardRef, useImperativeHandle, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useStore } from "../store";

export type CreatePostDialogHandle = {
  open: () => void;
};

export default forwardRef<CreatePostDialogHandle, { onCreated?: () => void }>(
  function CreatePostDialog(props, ref) {
    const { onCreated } = props;
    const { addPost, currentUser, users, isLoading } = useStore();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    useImperativeHandle(ref, () => ({ open: () => setOpen(true) }), []);

    const handleClose = () => setOpen(false);
    const handleCreate = () => {
      const userId = currentUser?.id ?? users[0]?.id;
      if (!userId) return;
      addPost({ userId, title, body });
      setTitle("");
      setBody("");
      setOpen(false);
      onCreated?.();
    };

    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create a new post</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <TextField
              label="Body"
              fullWidth
              multiline
              minRows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!title || !body || isLoading || users.length === 0}
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

