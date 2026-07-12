import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { sidebarForRole } from "../utils/roleConfig";
import RoleBadge from "./RoleBadge";

function NavList({ onNavigate }) {
  const { user } = useAuth();
  const items = sidebarForRole(user?.role);

  return (
    <nav className="flex-1 space-y-1 px-3">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                : "text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar({ mobileOpen = false, onClose }) {
  const { user } = useAuth();

  return (
    <>
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
        <div className="flex h-16 items-center gap-2 px-6">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">TransitOps</span>
        </div>
        <div className="px-6 pb-3">
          <RoleBadge role={user?.role} />
        </div>
        <NavList />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-slate-900 md:hidden"
            >
              <div className="flex h-16 items-center justify-between px-6">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">TransitOps</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-slate-400">
                  <FiX size={20} />
                </button>
              </div>
              <NavList onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
