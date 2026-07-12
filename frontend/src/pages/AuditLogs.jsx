import { useEffect, useState } from "react";
import api from "../services/api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api
      .get("/audit-logs")
      .then(({ data }) => setLogs(data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Audit Logs</h1>
      <p className="text-xs text-gray-500 dark:text-slate-400">
        Records role/status changes and create/delete actions on users, vehicles, drivers, and
        trips. Last 200 events.
      </p>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">By</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No audit events yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{log.userName || "-"}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{log.action}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{log.entity}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{log.details || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
