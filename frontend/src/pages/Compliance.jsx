import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

function daysUntil(dateValue) {
  return Math.ceil((new Date(dateValue) - new Date()) / (1000 * 60 * 60 * 24));
}

function bucketFor(days) {
  if (days < 0) return "Expired";
  if (days <= 7) return "7 days";
  if (days <= 15) return "15 days";
  if (days <= 30) return "30 days";
  return null;
}

const BUCKET_ORDER = ["Expired", "7 days", "15 days", "30 days"];
const BUCKET_STYLES = {
  Expired: "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10",
  "7 days": "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
  "15 days": "border-amber-100 bg-amber-50/60 dark:border-amber-500/10 dark:bg-amber-500/5",
  "30 days": "border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/40",
};

export default function Compliance() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    api
      .get("/drivers")
      .then(({ data }) => setDrivers(data || []))
      .catch(() => {});
  }, []);

  const buckets = BUCKET_ORDER.reduce((acc, label) => ({ ...acc, [label]: [] }), {});
  drivers.forEach((driver) => {
    const bucket = bucketFor(daysUntil(driver.licenseExpiryDate));
    if (bucket) buckets[bucket].push(driver);
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Compliance</h1>
      <p className="text-xs text-gray-500 dark:text-slate-400">
        Driver license expiry, grouped by urgency.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BUCKET_ORDER.map((label) => (
          <div key={label} className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
            <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-slate-100">
              {buckets[label].length}
            </p>
          </div>
        ))}
      </div>

      {BUCKET_ORDER.map(
        (label) =>
          buckets[label].length > 0 && (
            <div key={label} className={`rounded-xl border p-4 ${BUCKET_STYLES[label]}`}>
              <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-slate-300">
                {label === "Expired" ? "Expired" : `Expiring within ${label}`}
              </h2>
              <div className="overflow-x-auto rounded-lg bg-white dark:bg-slate-900">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-2">Driver</th>
                      <th className="px-4 py-2">License No.</th>
                      <th className="px-4 py-2">Expiry Date</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buckets[label].map((driver) => (
                      <tr key={driver._id} className="border-b last:border-0 dark:border-slate-800">
                        <td className="px-4 py-2 font-medium text-gray-800 dark:text-slate-100">
                          {driver.name}
                        </td>
                        <td className="px-4 py-2 text-gray-600 dark:text-slate-300">{driver.licenseNumber}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-slate-300">
                          {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <StatusBadge status={driver.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
      )}

      {drivers.length > 0 && BUCKET_ORDER.every((label) => buckets[label].length === 0) && (
        <div className="rounded-xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
          No licenses expiring within 30 days.
        </div>
      )}
    </div>
  );
}
