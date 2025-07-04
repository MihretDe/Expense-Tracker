import { useAuth0, User } from "@auth0/auth0-react";
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
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then((fetchedToken) => {
          sessionStorage.setItem("auth_token", fetchedToken);
          setToken(fetchedToken);
        })
        .catch(() => {
          sessionStorage.removeItem("auth_token");
          setToken(null);
        });

      if (auth0User) {
        sessionStorage.setItem("auth_user", JSON.stringify(auth0User));
        setUser(auth0User);
      }
    } else {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      setToken(null);
      setUser(undefined);
    }
  }, [isAuthenticated, getAccessTokenSilently, auth0User]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
