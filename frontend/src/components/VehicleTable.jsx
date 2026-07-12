import StatusBadge from "./StatusBadge";
import SortableHeader from "./SortableHeader";

export default function VehicleTable({ vehicles = [], onSelect, sortKey, sortDir, onSort }) {
  if (vehicles.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-gray-500 dark:text-slate-400">No vehicles found.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            <SortableHeader label="Registration No." sortKey="registrationNumber" activeKey={sortKey} activeDir={sortDir} onSort={onSort} />
            <SortableHeader label="Name" sortKey="name" activeKey={sortKey} activeDir={sortDir} onSort={onSort} />
            <SortableHeader label="Type" sortKey="type" activeKey={sortKey} activeDir={sortDir} onSort={onSort} />
            <SortableHeader label="Status" sortKey="status" activeKey={sortKey} activeDir={sortDir} onSort={onSort} />
            <SortableHeader label="Odometer" sortKey="odometer" activeKey={sortKey} activeDir={sortDir} onSort={onSort} />
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr
              key={vehicle._id}
              onClick={() => onSelect?.(vehicle)}
              className="cursor-pointer border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">
                {vehicle.registrationNumber}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{vehicle.name}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{vehicle.type}</td>
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
