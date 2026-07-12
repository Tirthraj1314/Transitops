import { NavLink } from "react-router-dom";
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

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/vehicles", label: "Vehicles", icon: FiTruck },
  { to: "/drivers", label: "Drivers", icon: FiUsers },
  { to: "/trips", label: "Trips", icon: FiMap },
  { to: "/maintenance", label: "Maintenance", icon: FiTool },
  { to: "/expenses", label: "Expenses", icon: FiDollarSign },
  { to: "/reports", label: "Reports", icon: FiBarChart2 },
  { to: "/profile", label: "Profile", icon: FiUser },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-white md:flex">
      <div className="flex h-16 items-center px-6 text-lg font-bold text-blue-600">TransitOps</div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
