import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Settings,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import LogoutButton from "../auth/LogoutButton";

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
          "fixed top-0 left-0 z-40 min-h-screen w-64 border-r dark:border-gray-700 p-4 flex flex-col justify-between transform transition-transform duration-300 bg-white dark:bg-gray-900",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
            "md:translate-x-0 md:static md:flex": true,
          }
        )}
      >
        <div>
          <div className="flex justify-between items-center mb-6 pl-2">
            <h1 className="text-xl font-bold">Expense Tracker</h1>
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
                      ? "bg-lime-400 text-white  "
                      : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300 "
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <LogoutButton />
      </div>
    </>
  );
}
