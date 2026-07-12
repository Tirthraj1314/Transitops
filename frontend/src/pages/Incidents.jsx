import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

const TYPES = ["Accident", "Violation", "Complaint", "Other"];
const SEVERITIES = ["Low", "Medium", "High"];

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  function loadIncidents() {
    api
      .get("/incidents")
      .then(({ data }) => setIncidents(data || []))
      .catch(() => {});
  }

  useEffect(() => {
    loadIncidents();
    api.get("/drivers").then(({ data }) => setDrivers(data || [])).catch(() => {});
  }, []);

  async function onAdd(payload) {
    try {
      await api.post("/incidents", payload);
      toast.success("Incident reported");
      reset();
      setModalOpen(false);
      loadIncidents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not report incident");
    }
  }

  async function resolve(id) {
    try {
      await api.patch(`/incidents/${id}/resolve`);
      toast.success("Incident resolved");
      loadIncidents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not resolve incident");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Incidents</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <FiPlus size={16} />
          Report Incident
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {incidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No incidents reported.
                </td>
              </tr>
            ) : (
              incidents.map((incident) => (
                <tr key={incident._id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {new Date(incident.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">
                    {incident.driver?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{incident.type}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{incident.severity}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{incident.description}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="px-4 py-3">
                    {incident.status === "Open" && (
                      <button
                        onClick={() => resolve(incident._id)}
                        className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={isModalOpen} title="Report Incident" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onAdd)} className="space-y-3">
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("driver", { required: true })}
          >
            <option value="">Select driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} — {d.licenseNumber}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("type", { required: true })}
          >
            <option value="">Select type</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            defaultValue="Medium"
            {...register("severity")}
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <textarea
            placeholder="What happened?"
            rows={3}
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("description", { required: true })}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Incident
          </button>
        </form>
      </Modal>
    </div>
  );
}
