import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import DriverTable from "../components/DriverTable";
import Modal from "../components/Modal";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { can } from "../utils/permissions";

export default function Drivers() {
  const { user } = useAuth();
  const canManage = can(user?.role, "drivers", "CRUD");
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [linkingDriver, setLinkingDriver] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const linkForm = useForm();

  function loadDrivers() {
    api
      .get("/drivers")
      .then(({ data }) => setDrivers(data || []))
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

  async function onLinkDriver(values) {
    try {
      await api.patch(`/drivers/${linkingDriver._id}/link-user`, { email: values.email || undefined });
      toast.success(values.email ? "Login account linked" : "Login account unlinked");
      linkForm.reset();
      setLinkingDriver(null);
      loadDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not link account");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Drivers</h1>
        {canManage && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <FiPlus size={16} />
            Add Driver
          </button>
        )}
      </div>

      <DriverTable
        drivers={drivers}
        canLink={canManage}
        onLink={(driver) => {
          linkForm.reset({ email: "" });
          setLinkingDriver(driver);
        }}
      />

      <Modal open={isModalOpen && canManage} title="Add Driver" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onAddDriver)} className="space-y-3">
          <input
            placeholder="Full name"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("name", { required: true })}
          />
          <input
            placeholder="License number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("licenseNumber", { required: true })}
          />
          <input
            placeholder="License category (e.g. LMV, HMV)"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("licenseCategory", { required: true })}
          />
          <input
            placeholder="License expiry date"
            type="date"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("licenseExpiryDate", { required: true })}
          />
          <input
            placeholder="Contact number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("contactNumber", { required: true })}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Driver
          </button>
        </form>
      </Modal>

      <Modal
        open={!!linkingDriver}
        title={`Link login account — ${linkingDriver?.name || ""}`}
        onClose={() => setLinkingDriver(null)}
      >
        <form onSubmit={linkForm.handleSubmit(onLinkDriver)} className="space-y-3">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Enter the email of a Driver-role account to link it to this driver record, so they see
            their assigned trips in the Driver portal. Leave blank and save to unlink.
          </p>
          <input
            placeholder="driver@transitops.com"
            type="email"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...linkForm.register("email")}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
}
