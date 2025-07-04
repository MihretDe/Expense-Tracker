import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Transactions", icon: CreditCard, path: "/transactions" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={clsx(
          "fixed top-0 left-0 z-40 min-h-screen w-64 bg-white border-r p-4 flex flex-col justify-between transform transition-transform duration-300",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
            "md:translate-x-0 md:static md:flex": true,
          }
        )}
      >
        <div>
          <div className="flex justify-between items-center mb-6 pl-2">
            <h1 className="text-xl font-bold">Maglo.</h1>
            <button className="md:hidden" onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium",
                    isActive
                      ? "bg-lime-400 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button className="flex items-center gap-3 px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg w-full">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );
}
