import {
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiShield,
  FiTruck,
  FiMap,
  FiTool,
  FiDroplet,
  FiDollarSign,
  FiBarChart2,
  FiBell,
  FiFileText,
  FiSettings,
  FiUser,
  FiFolder,
  FiClock,
  FiAlertTriangle,
  FiActivity,
} from "react-icons/fi";

const DASHBOARD = { to: "/dashboard", label: "Dashboard", icon: FiGrid };
const PROFILE = { to: "/profile", label: "Profile", icon: FiUser };
const VEHICLES = { to: "/vehicles", label: "Vehicles", icon: FiTruck };
const DRIVERS = { to: "/drivers", label: "Drivers", icon: FiUsers };
const TRIPS = { to: "/trips", label: "Trips", icon: FiMap };
const MAINTENANCE = { to: "/maintenance", label: "Maintenance", icon: FiTool };
const EXPENSES = { to: "/expenses", label: "Expenses", icon: FiDollarSign };
const FUEL_LOGS = { to: "/fuel-logs", label: "Fuel Logs", icon: FiDroplet };
const REPORTS = { to: "/reports", label: "Reports", icon: FiBarChart2 };
const TRIP_HISTORY = { to: "/trip-history", label: "Trip History", icon: FiClock };

export const SIDEBAR_BY_ROLE = {
  "Super Admin": [
    DASHBOARD,
    { to: "/companies", label: "Companies", icon: FiBriefcase },
    { to: "/users", label: "Users", icon: FiUsers },
    { to: "/roles", label: "Roles & Permissions", icon: FiShield },
    VEHICLES,
    DRIVERS,
    TRIPS,
    MAINTENANCE,
    FUEL_LOGS,
    EXPENSES,
    REPORTS,
    { to: "/notifications", label: "Notifications", icon: FiBell },
    { to: "/audit-logs", label: "Audit Logs", icon: FiFileText },
    { to: "/settings", label: "Settings", icon: FiSettings },
    PROFILE,
  ],
  "Fleet Manager": [
    DASHBOARD,
    VEHICLES,
    MAINTENANCE,
    { to: "/vehicle-documents", label: "Vehicle Documents", icon: FiFolder },
    TRIP_HISTORY,
    REPORTS,
    PROFILE,
  ],
  Dispatcher: [
    DASHBOARD,
    TRIPS,
    DRIVERS,
    VEHICLES,
    { to: "/live-tracking", label: "Live Tracking", icon: FiMap },
    TRIP_HISTORY,
    REPORTS,
    PROFILE,
  ],
  "Safety Officer": [
    DASHBOARD,
    DRIVERS,
    { to: "/compliance", label: "Compliance", icon: FiShield },
    { to: "/incidents", label: "Incidents", icon: FiAlertTriangle },
    { to: "/safety-reports", label: "Safety Reports", icon: FiActivity },
    PROFILE,
  ],
  "Finance Manager": [
    DASHBOARD,
    FUEL_LOGS,
    EXPENSES,
    { to: "/revenue", label: "Revenue", icon: FiDollarSign },
    { to: "/invoices", label: "Invoices", icon: FiFileText },
    REPORTS,
    { to: "/analytics", label: "Analytics", icon: FiBarChart2 },
    PROFILE,
  ],
  Driver: [
    DASHBOARD,
    { to: "/my-trips", label: "My Trips", icon: FiMap },
    TRIP_HISTORY,
    { to: "/documents", label: "Documents", icon: FiFolder },
    { to: "/notifications", label: "Notifications", icon: FiBell },
    PROFILE,
  ],
};

export function sidebarForRole(role) {
  return SIDEBAR_BY_ROLE[role] || [DASHBOARD, PROFILE];
}
