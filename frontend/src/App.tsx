import { useAuthContext } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const {  isLoading } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;
