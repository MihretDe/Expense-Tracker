import LoginButton from "./auth/LoginButton";
import LogoutButton from "./auth/LogoutButton";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const {user,isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated)
    return <div>Please log in to access the application.</div>;
  return (
      <>
      <h1>Welcome, {user?.name || "User"}!</h1>
      <LoginButton />
      <LogoutButton />
      </>  
      
   
  );
}

export default App;
