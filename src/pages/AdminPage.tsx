import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useStore } from "../store";

export default function AdminPage() {
  const { currentUser, users, updateUser, posts, updatePostPriority } =
    useStore();
  const isAdmin = useMemo(() => Boolean(currentUser?.isAdmin), [currentUser]);
  if (!isAdmin) return <Typography>Only admin can view this page.</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin
      </Typography>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Manage Users
          </Typography>
          <Stack spacing={2}>
            {users.map((u) => (
              <Paper key={u.id} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <TextField
                    label="Name"
                    value={u.name}
                    onChange={(e) => updateUser({ ...u, name: e.target.value })}
                  />
                  <TextField
                    label="Email"
                    value={u.email}
                    onChange={(e) =>
                      updateUser({ ...u, email: e.target.value })
                    }
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Post Priority
          </Typography>
          <Stack spacing={2}>
            {posts.map((p) => (
              <Paper key={p.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {p.title}
                    </Typography>
                    <TextField
                      type="number"
                      label="Priority"
                      value={p.priority ?? 0}
                      onChange={(e) =>
                        updatePostPriority(p.id, Number(e.target.value))
                      }
                      sx={{ width: 120 }}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => updatePostPriority(p.id, 0)}
                  >
                    Reset
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
