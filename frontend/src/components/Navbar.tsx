import { Menu, Bell, Sun, Moon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { useEffect } from "react";
import { fetchUser } from "../features/user/userSlice";

interface NavbarProps {
  onToggleSidebar: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const routeTitleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function Navbar({
  onToggleSidebar,
  darkMode,
  onToggleDarkMode,
}: NavbarProps) {
  const dispatch = useAppDispatch();
  const { user: auth0User, token } = useAuthContext();
  const user = useAppSelector((state) => state.user.user);
  const userLoading = useAppSelector((state) => state.user.userLoading);
  const location = useLocation();
  const pageTitle = routeTitleMap[location.pathname] || "Dashboard";

  // Refetch user after update/login
  useEffect(() => {
    if (auth0User?.sub && token) {
      dispatch(fetchUser({ token, auth0Id: auth0User.sub }));
    }
  }, [auth0User?.sub, token, dispatch]);

  return (
    <div
      className={`w-full h-16 px-6 border-b dark:border-gray-700 flex justify-between items-center transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <button className="md:hidden" onClick={onToggleSidebar}>
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <img
            src={auth0User?.picture}
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            {userLoading || !user?.name
              ? "Loading..."
              : `${user.name} ${user.lastName ?? ""}`}
          </span>
        </div>
      </div>
    </div>
  );
}
