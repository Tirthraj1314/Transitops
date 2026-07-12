import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Modal from "../components/Modal";
import api from "../services/api";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  function loadCompanies() {
    api
      .get("/companies")
      .then(({ data }) => setCompanies(data || []))
      .catch(() => {});
  }

  useEffect(loadCompanies, []);

  async function onAdd(payload) {
    try {
      await api.post("/companies", payload);
      toast.success("Company added");
      reset();
      setModalOpen(false);
      loadCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add company");
    }
  }

  async function onDelete(id) {
    try {
      await api.delete(`/companies/${id}`);
      toast.success("Company deleted");
      loadCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete company");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Companies</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <FiPlus size={16} />
          Add Company
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-slate-400">
        A directory of client/operator companies. Vehicles, drivers, and trips aren't scoped to a
        company yet — this is a contact list, not multi-tenant data isolation.
      </p>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact Email</th>
              <th className="px-4 py-3">Contact Phone</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No companies added yet.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company._id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{company.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{company.contactEmail || "-"}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{company.contactPhone || "-"}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{company.address || "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDelete(company._id)}
                      className="text-gray-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={isModalOpen} title="Add Company" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onAdd)} className="space-y-3">
          <input
            placeholder="Company name"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("name", { required: true })}
          />
          <input
            placeholder="Contact email"
            type="email"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("contactEmail")}
          />
          <input
            placeholder="Contact phone"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("contactPhone")}
          />
          <input
            placeholder="Address"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("address")}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Company
          </button>
        </form>
      </Modal>
    </div>
  );
}
