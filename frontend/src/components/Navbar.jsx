import { useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiMenu, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import GlobalSearch from "./GlobalSearch";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 md:hidden"
        >
          <FiMenu size={22} />
        </button>
        <h1 className="hidden text-base font-semibold text-gray-800 dark:text-slate-100 sm:block">
          Fleet Overview
        </h1>
      </div>

      <div className="hidden flex-1 justify-center md:flex">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        <div className="hidden items-center gap-2 text-sm text-gray-600 dark:text-slate-300 sm:flex">
          <FiUser size={16} />
          {user?.name || "Guest"}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <FiLogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
