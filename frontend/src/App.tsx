import { ToastContainer } from "react-toastify";
import { useAuthContext } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const {  isLoading } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
