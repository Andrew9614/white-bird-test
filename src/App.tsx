import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Layout from "./components/Layout";
import { BrowserRouter } from "react-router-dom";
import StoreProvider, { useStore } from "./store";
import AppRoutes from "./routes";

function Shell() {
  const { isLoading, error } = useStore();
  return (
    <Layout>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <AppRoutes />
    </Layout>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </StoreProvider>
  );
}
