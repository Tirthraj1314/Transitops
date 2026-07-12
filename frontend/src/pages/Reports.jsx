import { useEffect, useState } from "react";
import { TrendChart, ComparisonChart } from "../components/Charts";
import api from "../services/api";

export default function Reports() {
  const [fuelUsage, setFuelUsage] = useState([]);
  const [tripsByVehicle, setTripsByVehicle] = useState([]);

  useEffect(() => {
    api
      .get("/reports")
      .then(({ data }) => {
        setFuelUsage(data.fuelUsage || []);
        setTripsByVehicle(data.tripsByVehicle || []);
      })
      .catch(() => {
        // report data unavailable until the backend is connected
      });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Reports</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Fuel usage trend</h2>
          <TrendChart data={fuelUsage} dataKey="liters" xKey="month" color="#f59e0b" />
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Trips by vehicle</h2>
          <ComparisonChart data={tripsByVehicle} dataKey="trips" xKey="vehicle" color="#2563eb" />
        </div>
      </div>
    </div>
  );
}
