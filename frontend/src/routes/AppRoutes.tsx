import { Routes, Route } from "react-router-dom";
import Reports from "../pages/Reports";
import Transactions from "../pages/Transactions";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoute";


const AppRoutes = () => (
  <Routes>
    {/* Public Route */}
    <Route path="/login" element={<LoginPage />} />

    {/* Protected Routes */}
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<Layout />}>
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
