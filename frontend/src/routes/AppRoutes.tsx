import { Routes, Route } from "react-router-dom";
import Reports from "../pages/Reports";
import Transactions from "../pages/Transactions";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
