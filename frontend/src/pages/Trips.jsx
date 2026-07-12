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
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Trips</h1>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
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
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No trips found.
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip.id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{trip.route}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{trip.vehicle}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{trip.driver}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{trip.departureTime}</td>
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
