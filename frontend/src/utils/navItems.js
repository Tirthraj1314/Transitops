import {
  FiGrid,
  FiTruck,
  FiUsers,
  FiMap,
  FiTool,
  FiDollarSign,
  FiBarChart2,
  FiUser,
} from "react-icons/fi";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/vehicles", label: "Vehicles", icon: FiTruck },
  { to: "/drivers", label: "Drivers", icon: FiUsers },
  { to: "/trips", label: "Trips", icon: FiMap },
  { to: "/maintenance", label: "Maintenance", icon: FiTool },
  { to: "/expenses", label: "Expenses", icon: FiDollarSign },
  { to: "/reports", label: "Reports", icon: FiBarChart2 },
  { to: "/profile", label: "Profile", icon: FiUser },
];
