import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import api from "../services/api";

export default function Settings() {
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    // Hits an authenticated, DB-backed route so this actually confirms
    // both the API and the database connection are healthy.
    api
      .get("/dashboard")
      .then(() => setApiStatus("up"))
      .catch(() => setApiStatus("down"));
  }, []);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Settings</h1>

      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-300">System Health</h2>
        <div className="flex items-center gap-2 text-sm">
          {apiStatus === "up" ? (
            <>
              <FiCheckCircle className="text-green-500" />
              <span className="text-gray-700 dark:text-slate-300">API and database connection are healthy</span>
            </>
          ) : apiStatus === "down" ? (
            <>
              <FiXCircle className="text-red-500" />
              <span className="text-gray-700 dark:text-slate-300">Cannot reach the backend</span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-slate-400">Checking...</span>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-slate-300">Administration</h2>
        <p className="mb-4 text-xs text-gray-500 dark:text-slate-400">
          There's no separate configurable-settings store yet (no feature flags, branding, or
          system-wide preferences) — these links are the closest things to "system settings" that
          actually exist today.
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/users" className="text-blue-600 hover:underline dark:text-blue-400">
            Manage Users
          </Link>
          <Link to="/roles" className="text-blue-600 hover:underline dark:text-blue-400">
            View Roles & Permissions
          </Link>
          <Link to="/companies" className="text-blue-600 hover:underline dark:text-blue-400">
            Manage Companies
          </Link>
          <Link to="/audit-logs" className="text-blue-600 hover:underline dark:text-blue-400">
            View Audit Logs
          </Link>
        </div>
      </div>
    </div>
  );
}
