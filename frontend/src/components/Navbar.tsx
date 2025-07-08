import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

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
  const { user } = useAuthContext();
  const location = useLocation();
  const pageTitle = routeTitleMap[location.pathname] || "Page";

  return (
    <div
      className={`w-full h-16 px-6 border-b flex justify-between items-center transition-colors duration-300 ${
        darkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button className="md:hidden" onClick={onToggleSidebar}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <label className="flex items-center cursor-pointer">
          <span className="mr-2 text-sm text-gray-700 dark:text-gray-200">
            Dark Mode
          </span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={onToggleDarkMode}
            className="toggle-checkbox hidden"
          />
          <div
            className={`w-10 h-5 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 duration-300 ease-in-out ${
              darkMode ? "bg-green-400" : ""
            }`}
          >
            <div
              className={`bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                darkMode ? "translate-x-5" : ""
              }`}
            ></div>
          </div>
        </label>

        <div className="flex items-center gap-2">
          <img
            src={user?.picture}
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {user?.name}
          </span>
        </div>
      </div>
    </div>
  );
}
