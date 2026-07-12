import StatusBadge from "./StatusBadge";

export default function DriverTable({ drivers = [], onSelect }) {
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
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Assigned Vehicle</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr
              key={driver.id}
              onClick={() => onSelect?.(driver)}
              className="cursor-pointer border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{driver.name}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{driver.licenseNumber}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{driver.phone}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{driver.vehicle || "Unassigned"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={driver.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
