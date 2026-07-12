import { FiFile } from "react-icons/fi";
import StatusBadge from "./StatusBadge";

export default function DriverTable({ drivers = [], onSelect, onLink, onDocuments, canLink = false }) {
  if (drivers.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-gray-500 dark:text-slate-400">No drivers found.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">License No.</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Safety Score</th>
            <th className="px-4 py-3">Status</th>
            {canLink && <th className="px-4 py-3">Login Account</th>}
            {canLink && <th className="px-4 py-3">Documents</th>}
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr
              key={driver._id}
              className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <td
                onClick={() => onSelect?.(driver)}
                className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-slate-100"
              >
                {driver.name}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{driver.licenseNumber}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{driver.contactNumber}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{driver.safetyScore}</td>
              <td className="px-4 py-3">
                <StatusBadge status={driver.status} />
              </td>
              {canLink && (
                <td className="px-4 py-3">
                  <button
                    onClick={() => onLink?.(driver)}
                    className="rounded-lg border px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {driver.user ? "Linked" : "Link account"}
                  </button>
                </td>
              )}
              {canLink && (
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDocuments?.(driver)}
                    className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FiFile size={12} />
                    {driver.documents?.length || 0}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
