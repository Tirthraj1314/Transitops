import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import VehicleTable from "../components/VehicleTable";
import Modal from "../components/Modal";
import api from "../services/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  function loadVehicles() {
    api
      .get("/vehicles")
      .then(({ data }) => setVehicles(data.vehicles || []))
      .catch(() => {
        // vehicle data unavailable until the backend is connected
      });
  }

  useEffect(loadVehicles, []);

  async function onAddVehicle(payload) {
    try {
      await api.post("/vehicles", payload);
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
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <FiPlus size={16} />
          Add Vehicle
        </button>
      </div>

      <VehicleTable vehicles={vehicles} />

      <Modal open={isModalOpen} title="Add Vehicle" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onAddVehicle)} className="space-y-3">
          <input
            placeholder="Vehicle number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("number", { required: true })}
          />
          <input
            placeholder="Type (Truck, Van, ...)"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("type", { required: true })}
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
