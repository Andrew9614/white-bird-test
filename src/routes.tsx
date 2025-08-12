import { Routes, Route, Navigate, useParams } from "react-router-dom";
import PostsPage from "./pages/PostsPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import FavoritesPage from "./pages/FavoritesPage";

function PostDetailsWrapper() {
  const { postId } = useParams();
  const id = Number(postId);
  if (Number.isNaN(id)) return <Navigate to="/posts" replace />;
  return <PostDetailsPage postId={id} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/posts" replace />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/post/:postId" element={<PostDetailsWrapper />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="*" element={<Navigate to="/posts" replace />} />
    </Routes>
  );
}
