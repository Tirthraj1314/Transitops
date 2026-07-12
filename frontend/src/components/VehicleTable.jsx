import StatusBadge from "./StatusBadge";

export default function VehicleTable({ vehicles = [], onSelect }) {
  if (vehicles.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-gray-500 dark:text-slate-400">No vehicles found.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Vehicle No.</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Odometer</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.id}
              onClick={() => onSelect?.(vehicle)}
              className="cursor-pointer border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{vehicle.number}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{vehicle.type}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{vehicle.driver || "Unassigned"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={vehicle.status} />
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                {vehicle.odometer?.toLocaleString() ?? "-"} km
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
