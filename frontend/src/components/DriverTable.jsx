import StatusBadge from "./StatusBadge";

export default function DriverTable({ drivers = [], onSelect }) {
  if (drivers.length === 0) {
    return <p className="p-6 text-center text-sm text-gray-500">No drivers found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-500">
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
              className="cursor-pointer border-b last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium text-gray-800">{driver.name}</td>
              <td className="px-4 py-3 text-gray-600">{driver.licenseNumber}</td>
              <td className="px-4 py-3 text-gray-600">{driver.phone}</td>
              <td className="px-4 py-3 text-gray-600">{driver.vehicle || "Unassigned"}</td>
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
