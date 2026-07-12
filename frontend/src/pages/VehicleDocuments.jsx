import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiFile, FiUpload } from "react-icons/fi";
import Modal from "../components/Modal";
import api from "../services/api";

const LABELS = ["RC", "Insurance", "PUC", "Fitness Certificate", "Other"];

export default function VehicleDocuments() {
  const [vehicles, setVehicles] = useState([]);
  const [uploadingFor, setUploadingFor] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  function loadVehicles() {
    api
      .get("/vehicles")
      .then(({ data }) => setVehicles(data || []))
      .catch(() => {});
  }

  useEffect(loadVehicles, []);

  async function onUpload(values) {
    try {
      const formData = new FormData();
      formData.append("label", values.label);
      formData.append("file", values.file[0]);
      await api.post(`/vehicles/${uploadingFor._id}/documents`, formData);
      toast.success("Document uploaded");
      reset();
      setUploadingFor(null);
      loadVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not upload document");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Vehicle Documents</h1>

      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-slate-100">{vehicle.registrationNumber}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{vehicle.name}</p>
              </div>
              <button
                onClick={() => {
                  reset();
                  setUploadingFor(vehicle);
                }}
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <FiUpload size={14} />
                Upload
              </button>
            </div>

            {vehicle.documents?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {vehicle.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={`${import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:5000"}${doc.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <FiFile size={12} />
                    {doc.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 dark:text-slate-500">No documents uploaded.</p>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={!!uploadingFor}
        title={`Upload Document — ${uploadingFor?.registrationNumber || ""}`}
        onClose={() => setUploadingFor(null)}
      >
        <form onSubmit={handleSubmit(onUpload)} className="space-y-3">
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("label", { required: true })}
          >
            {LABELS.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("file", { required: true })}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Upload
          </button>
        </form>
      </Modal>
    </div>
  );
}
