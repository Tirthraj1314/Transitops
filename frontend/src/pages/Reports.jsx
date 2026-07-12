import { useEffect, useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";
import { ComparisonChart } from "../components/Charts";
import api from "../services/api";

export default function Reports() {
  const [report, setReport] = useState([]);

  useEffect(() => {
    api
      .get("/reports")
      .then(({ data }) => setReport(data || []))
      .catch(() => {
        // report data unavailable until the backend is connected
      });
  }, []);

  async function downloadFile(path, filename) {
    const { data } = await api.get(path, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Reports</h1>
        <div className="flex gap-2">
          <button
            onClick={() => downloadFile("/reports/export/csv", "transitops_report.csv")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <FiDownload size={16} />
            Export CSV
          </button>
          <button
            onClick={() => downloadFile("/reports/export/pdf", "transitops_report.pdf")}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FiFileText size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
            Fuel efficiency by vehicle (km/L)
          </h2>
          <ComparisonChart
            data={report}
            dataKey="fuelEfficiencyKmPerLiter"
            xKey="registrationNumber"
            color="#f59e0b"
          />
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-300">ROI by vehicle (%)</h2>
          <ComparisonChart data={report} dataKey="roiPercentage" xKey="registrationNumber" color="#2563eb" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Trips</th>
              <th className="px-4 py-3">Distance (km)</th>
              <th className="px-4 py-3">Fuel Cost</th>
              <th className="px-4 py-3">Operational Cost</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">ROI %</th>
            </tr>
          </thead>
          <tbody>
            {report.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No report data found.
                </td>
              </tr>
            ) : (
              report.map((row) => (
                <tr
                  key={row.registrationNumber}
                  className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">
                    {row.registrationNumber} · {row.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{row.totalTripsCompleted}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{row.totalDistanceKm}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">₹{row.totalFuelCost}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">₹{row.totalOperationalCost}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">₹{row.totalRevenue}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{row.roiPercentage}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
