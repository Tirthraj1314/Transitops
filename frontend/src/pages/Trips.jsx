import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { can } from "../utils/permissions";
import DriverTrips from "./DriverTrips";

export default function Trips() {
  const { user } = useAuth();
  return user?.role === "Driver" ? <DriverTrips /> : <TripsManager />;
}

function TripsManager() {
  const { user } = useAuth();
  const canManage = can(user?.role, "trips", "CRUD");
  const [trips, setTrips] = useState([]);

  function loadTrips() {
    api
      .get("/trips")
      .then(({ data }) => setTrips(data || []))
      .catch(() => {
        // trip data unavailable until the backend is connected
      });
  }

  useEffect(loadTrips, []);

  async function runAction(id, action) {
    try {
      await api.patch(`/trips/${id}/${action}`);
      toast.success(`Trip ${action}d`);
      loadTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || `Could not ${action} trip`);
    }
  }

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
              <th className="px-4 py-3">Status</th>
              {canManage && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td
                  colSpan={canManage ? 5 : 4}
                  className="px-4 py-6 text-center text-gray-500 dark:text-slate-400"
                >
                  No trips found.
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
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{trip.driver?.name || "-"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={trip.status} />
                  </td>
                  {canManage && (
                    <td className="px-4 py-3">
                      {trip.status === "Draft" && (
                        <button
                          onClick={() => runAction(trip._id, "dispatch")}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          Dispatch
                        </button>
                      )}
                      {(trip.status === "Dispatched" || trip.status === "In Progress") && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => runAction(trip._id, "complete")}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => runAction(trip._id, "cancel")}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
