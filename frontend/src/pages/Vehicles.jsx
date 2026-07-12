import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import VehicleTable from "../components/VehicleTable";
import Modal from "../components/Modal";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { can } from "../utils/permissions";

export default function Vehicles() {
  const { user } = useAuth();
  const canManage = can(user?.role, "vehicles", "CRUD");
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  function loadVehicles() {
    api
      .get("/vehicles")
      .then(({ data }) => setVehicles(data || []))
      .catch(() => {
        // vehicle data unavailable until the backend is connected
      });
  }

  useEffect(loadVehicles, []);

  async function onAddVehicle(payload) {
    try {
      await api.post("/vehicles", {
        ...payload,
        maxLoadCapacity: Number(payload.maxLoadCapacity),
        acquisitionCost: Number(payload.acquisitionCost),
        odometer: payload.odometer ? Number(payload.odometer) : 0,
      });
      toast.success("Vehicle added");
      reset();
      setModalOpen(false);
      loadVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add vehicle");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Vehicles</h1>
        {canManage && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <FiPlus size={16} />
            Add Vehicle
          </button>
        )}
      </div>

      <VehicleTable vehicles={vehicles} />

      <Modal open={isModalOpen && canManage} title="Add Vehicle" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onAddVehicle)} className="space-y-3">
          <input
            placeholder="Registration number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("registrationNumber", { required: true })}
          />
          <input
            placeholder="Name (e.g. Van-05)"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("name", { required: true })}
          />
          <input
            placeholder="Type (Truck, Van, ...)"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("type", { required: true })}
          />
          <input
            placeholder="Max load capacity (kg)"
            type="number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("maxLoadCapacity", { required: true })}
          />
          <input
            placeholder="Acquisition cost"
            type="number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("acquisitionCost", { required: true })}
          />
          <input
            placeholder="Region"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("region")}
          />
          <input
            placeholder="Odometer (km)"
            type="number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("odometer")}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Vehicle
          </button>
        </form>
      </Modal>
    </div>
  );
}
