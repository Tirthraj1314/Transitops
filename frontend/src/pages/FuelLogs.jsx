import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Modal from "../components/Modal";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { can } from "../utils/permissions";

export default function FuelLogs() {
  const { user } = useAuth();
  const canManage = can(user?.role, "fuel", "CRUD");
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  function loadLogs() {
    api
      .get("/fuel")
      .then(({ data }) => setLogs(data || []))
      .catch(() => {});
  }

  useEffect(() => {
    loadLogs();
    if (canManage) {
      api.get("/vehicles").then(({ data }) => setVehicles(data || [])).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onAddLog(payload) {
    try {
      await api.post("/fuel", {
        ...payload,
        liters: Number(payload.liters),
        cost: Number(payload.cost),
      });
      toast.success("Fuel log added");
      reset();
      setModalOpen(false);
      loadLogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add fuel log");
    }
  }

  async function onDelete(id) {
    try {
      await api.delete(`/fuel/${id}`);
      toast.success("Fuel log deleted");
      loadLogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete fuel log");
    }
  }

  const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);
  const totalLiters = logs.reduce((sum, log) => sum + (log.liters || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Fuel Logs</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
            {totalLiters.toLocaleString()} L · ₹{totalCost.toLocaleString()}
          </span>
          {canManage && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <FiPlus size={16} />
              Add Fuel Entry
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Liters</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Price/L</th>
              {canManage && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No fuel logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {log.date ? new Date(log.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">
                    {log.vehicle?.registrationNumber || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{log.liters} L</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">₹{log.cost?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    ₹{log.liters ? (log.cost / log.liters).toFixed(2) : "-"}
                  </td>
                  {canManage && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onDelete(log._id)}
                        className="text-gray-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={isModalOpen && canManage} title="Add Fuel Entry" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onAddLog)} className="space-y-3">
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("vehicle", { required: true })}
          >
            <option value="">Select vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.registrationNumber} — {v.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Quantity (liters)"
            type="number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("liters", { required: true })}
          />
          <input
            placeholder="Total cost"
            type="number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("cost", { required: true })}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Fuel Entry
          </button>
        </form>
      </Modal>
    </div>
  );
}
