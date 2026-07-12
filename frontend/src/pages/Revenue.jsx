import { useEffect, useState } from "react";
import { TrendChart } from "../components/Charts";
import api from "../services/api";

function monthLabel(dateValue) {
  return new Date(dateValue).toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

export default function Revenue() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    api
      .get("/trips?status=Completed")
      .then(({ data }) => setTrips(data || []))
      .catch(() => {});
  }, []);

  const totalRevenue = trips.reduce((sum, t) => sum + (t.revenue || 0), 0);
  const avgRevenue = trips.length ? Math.round(totalRevenue / trips.length) : 0;

  const byMonth = {};
  trips.forEach((t) => {
    const label = monthLabel(t.updatedAt);
    byMonth[label] = (byMonth[label] || 0) + (t.revenue || 0);
  });
  const trend = Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue }));

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Revenue</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <p className="text-sm text-gray-500 dark:text-slate-400">Total Revenue</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-slate-100">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <p className="text-sm text-gray-500 dark:text-slate-400">Completed Trips</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-slate-100">{trips.length}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <p className="text-sm text-gray-500 dark:text-slate-400">Avg Revenue / Trip</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-slate-100">
            ₹{avgRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Revenue by month</h2>
        <TrendChart data={trend} dataKey="revenue" xKey="month" color="#16a34a" />
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Completed</th>
              <th className="px-4 py-3">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No completed trips yet.
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip._id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">
                    {trip.source} → {trip.destination}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {trip.vehicle?.registrationNumber || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {new Date(trip.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">₹{trip.revenue?.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
