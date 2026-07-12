import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Modal from "../components/Modal";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { can } from "../utils/permissions";

const EXPENSE_TYPES = [
  "Fuel",
  "Repair",
  "Maintenance",
  "Insurance",
  "Tyres",
  "Battery",
  "Permit",
  "Toll",
  "Parking",
  "Fine",
  "Miscellaneous",
];

export default function Expenses() {
  const { user } = useAuth();
  const canManage = can(user?.role, "expenses", "CRUD");
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  function loadExpenses() {
    api
      .get("/expenses")
      .then(({ data }) => setExpenses(data || []))
      .catch(() => {});
  }

  useEffect(() => {
    loadExpenses();
    if (canManage) {
      api.get("/vehicles").then(({ data }) => setVehicles(data || [])).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onAddExpense(payload) {
    try {
      await api.post("/expenses", { ...payload, amount: Number(payload.amount) });
      toast.success("Expense added");
      reset();
      setModalOpen(false);
      loadExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add expense");
    }
  }

  async function onDelete(id) {
    try {
      await api.delete(`/expenses/${id}`);
      toast.success("Expense deleted");
      loadExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete expense");
    }
  }

  const total = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Expenses</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
            Total: ₹{total.toLocaleString()}
          </span>
          {canManage && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <FiPlus size={16} />
              Add Expense
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Notes</th>
              {canManage && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense._id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {expense.date ? new Date(expense.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{expense.category}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {expense.vehicle?.registrationNumber || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">₹{expense.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{expense.notes || "-"}</td>
                  {canManage && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onDelete(expense._id)}
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

      <Modal open={isModalOpen && canManage} title="Add Expense" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onAddExpense)} className="space-y-3">
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
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("category", { required: true })}
          >
            <option value="">Select category</option>
            {EXPENSE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            placeholder="Amount"
            type="number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("amount", { required: true })}
          />
          <input
            placeholder="Remarks (optional)"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...register("notes")}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Expense
          </button>
        </form>
      </Modal>
    </div>
  );
}
