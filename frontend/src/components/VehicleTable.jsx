import StatusBadge from "./StatusBadge";

export default function VehicleTable({ vehicles = [], onSelect }) {
  if (vehicles.length === 0) {
    return <p className="p-6 text-center text-sm text-gray-500">No vehicles found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-500">
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
              className="cursor-pointer border-b last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium text-gray-800">{vehicle.number}</td>
              <td className="px-4 py-3 text-gray-600">{vehicle.type}</td>
              <td className="px-4 py-3 text-gray-600">{vehicle.driver || "Unassigned"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={vehicle.status} />
              </td>
              <td className="px-4 py-3 text-gray-600">{vehicle.odometer?.toLocaleString() ?? "-"} km</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
