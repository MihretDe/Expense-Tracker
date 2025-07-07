import { useAuth0 } from "@auth0/auth0-react";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    // 🔄 Clear session flags
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("user_synced");

    logout({
      logoutParams: {
        returnTo: window.location.origin + "/login",
      },
    });
  };

  return (
    <button
      className="flex items-center gap-3 px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg w-full"
      onClick={handleLogout}
    >
      <LogOut className="w-5 h-5" />
      Logout
    </button>
  );
};

export default LogoutButton;
