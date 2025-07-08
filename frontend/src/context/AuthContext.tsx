import { useAuth0, User } from "@auth0/auth0-react";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | undefined;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();



  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem("auth_token") || null
  );

  const [user, setUser] = useState<User | undefined>(() => {
    const stored = sessionStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : undefined;
  });

  useEffect(() => {
    const saveUserToBackend = async () => {
      try {
        if (!isAuthenticated || !auth0User) return;

        const token = await getAccessTokenSilently();
        setToken(token);
        setUser(auth0User);

        // Check if already saved in session to avoid re-sending
        if (sessionStorage.getItem("user_synced") === "true") return;

        await axios.post(
          `${process.env.REACT_APP_API_URL}/users`,
          {
            auth0Id: auth0User.sub,
            email: auth0User.email,
            name: auth0User.given_name || auth0User.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ User synced with backend");

        // Mark user as synced to prevent re-posting on every refresh
        sessionStorage.setItem("user_synced", "true");
      } catch (err) {
        console.error("❌ Failed to sync user", err);
      }
    };

    saveUserToBackend();
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);


  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
