import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function Maintenance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api
      .get("/maintenance")
      .then(({ data }) => setRecords(data.records || []))
      .catch(() => {
        // maintenance data unavailable until the backend is connected
      });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Maintenance</h1>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Service Type</th>
              <th className="px-4 py-3">Scheduled Date</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No maintenance records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{record.vehicle}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{record.serviceType}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{record.scheduledDate}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">₹{record.cost?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={record.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
