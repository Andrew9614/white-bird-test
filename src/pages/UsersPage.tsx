import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useStore } from "../store";

export default function UsersPage() {
  const { users } = useStore();
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Users
      </Typography>
      <List>
        {users.map((u) => (
          <ListItem
            key={u.id}
            divider
            secondaryAction={
              u.isAdmin ? (
                <Chip color="primary" label="Admin" size="small" />
              ) : undefined
            }
          >
            <Avatar sx={{ mr: 2 }}>{u.name.charAt(0)}</Avatar>
            <ListItemText
              primary={u.name}
              secondary={`${u.email}${u.address ? ` • ${u.address.city}` : ""}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
