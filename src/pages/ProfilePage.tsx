import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStore } from "../store";
import type { User } from "../types";

export default function ProfilePage() {
  const { currentUser, updateUser, users, setCurrentUserId } = useStore();
  const [form, setForm] = useState<User | undefined>(currentUser);
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(currentUser),
    [form, currentUser],
  );

  if (!form) return <Typography>No current user</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Profile
      </Typography>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <TextField
          select
          label="Switch user"
          value={form.id}
          onChange={(e) => setCurrentUserId(Number(e.target.value))}
        >
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          label="City"
          value={form.address?.city ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              address: {
                ...(form.address ?? { street: "", city: "", zipcode: "" }),
                city: e.target.value,
              },
            })
          }
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            disabled={!isDirty}
            onClick={() => form && updateUser(form)}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
