import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function Trips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    api
      .get("/trips")
      .then(({ data }) => setTrips(data.trips || []))
      .catch(() => {
        // trip data unavailable until the backend is connected
      });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800">Trips</h1>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Departure</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No trips found.
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{trip.route}</td>
                  <td className="px-4 py-3 text-gray-600">{trip.vehicle}</td>
                  <td className="px-4 py-3 text-gray-600">{trip.driver}</td>
                  <td className="px-4 py-3 text-gray-600">{trip.departureTime}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={trip.status} />
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
