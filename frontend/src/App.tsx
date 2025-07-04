import { useAuthContext } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated)
    return <div>Please log in to access the application.</div>;

  return (
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;
