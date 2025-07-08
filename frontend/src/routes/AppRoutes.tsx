import { Routes, Route } from "react-router-dom";
import Reports from "../pages/Reports";
import Transactions from "../pages/Transactions";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoute";

interface AppRoutesProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
} 
const AppRoutes = ({ darkMode, onToggleDarkMode }: AppRoutesProps) => (
  <Routes>
    {/* Public Route */}
    <Route path="/login" element={<LoginPage />} />

    {/* Protected Routes */}
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<Layout darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
