import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./context/ThemeContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Trips from "./pages/Trips";
import Maintenance from "./pages/Maintenance";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import FuelLogs from "./pages/FuelLogs";
import Revenue from "./pages/Revenue";
import Invoices from "./pages/Invoices";
import Notifications from "./pages/Notifications";
import AuditLogs from "./pages/AuditLogs";
import Incidents from "./pages/Incidents";
import Compliance from "./pages/Compliance";
import Companies from "./pages/Companies";
import ComingSoon from "./pages/ComingSoon";
import RequireRole from "./components/RequireRole";

export default function App() {
  const { theme } = useTheme();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style:
            theme === "dark"
              ? { background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155" }
              : undefined,
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Reports />} />
          <Route path="/trip-history" element={<Trips />} />
          <Route path="/profile" element={<Profile />} />

          <Route
            path="/companies"
            element={
              <RequireRole roles={["Super Admin"]}>
                <Companies />
              </RequireRole>
            }
          />
          <Route
            path="/users"
            element={
              <RequireRole roles={["Super Admin"]}>
                <Users />
              </RequireRole>
            }
          />
          <Route path="/roles" element={<ComingSoon title="Roles & Permissions" />} />
          <Route path="/fuel-logs" element={<FuelLogs />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route
            path="/audit-logs"
            element={
              <RequireRole roles={["Super Admin"]}>
                <AuditLogs />
              </RequireRole>
            }
          />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
          <Route path="/vehicle-documents" element={<ComingSoon title="Vehicle Documents" />} />
          <Route path="/live-tracking" element={<ComingSoon title="Live Tracking" />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/safety-reports" element={<ComingSoon title="Safety Reports" />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/my-trips" element={<Trips />} />
          <Route path="/documents" element={<ComingSoon title="Documents" />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
