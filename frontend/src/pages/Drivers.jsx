import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import DriverTable from "../components/DriverTable";
import Modal from "../components/Modal";
import api from "../services/api";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  function loadDrivers() {
    api
      .get("/drivers")
      .then(({ data }) => setDrivers(data.drivers || []))
      .catch(() => {
        // driver data unavailable until the backend is connected
      });
  }

  useEffect(loadDrivers, []);

  async function onAddDriver(payload) {
    try {
      await api.post("/drivers", payload);
      toast.success("Driver added");
      reset();
      setModalOpen(false);
      loadDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add driver");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Drivers</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <FiPlus size={16} />
          Add Driver
        </button>
      </div>

      <DriverTable drivers={drivers} />

      <Modal open={isModalOpen} title="Add Driver" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onAddDriver)} className="space-y-3">
          <input
            placeholder="Full name"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            {...register("name", { required: true })}
          />
          <input
            placeholder="License number"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            {...register("licenseNumber", { required: true })}
          />
          <input
            placeholder="Phone"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            {...register("phone")}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Driver
          </button>
        </form>
      </Modal>
    </div>
  );
}
