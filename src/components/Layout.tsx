import { Fragment, useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, favoritePostIds } = useStore();
  const isAdmin = useMemo(() => Boolean(currentUser?.isAdmin), [currentUser]);
  const navigate = useNavigate();
  return (
    <Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/posts")}
          >
            Forum
          </Typography>
          <Tooltip title="Posts">
            <IconButton color="inherit" onClick={() => navigate("/posts")}>
              <ArticleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Users">
            <IconButton color="inherit" onClick={() => navigate("/users")}>
              <GroupIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Favorites">
            <IconButton color="inherit" onClick={() => navigate("/favorites")}>
              <Badge
                color="secondary"
                badgeContent={favoritePostIds.length}
                showZero
              >
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          {isAdmin && (
            <Tooltip title="Admin">
              <IconButton color="inherit" onClick={() => navigate("/admin")}>
                <AdminPanelSettingsIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Profile">
            <IconButton color="inherit" onClick={() => navigate("/profile")}>
              <PersonIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ py: 3 }}>
        <Container maxWidth="md">{children}</Container>
      </Box>
    </Fragment>
  );
}
