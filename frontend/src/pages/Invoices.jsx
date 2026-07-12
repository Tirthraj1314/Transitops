import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);

  function loadInvoices() {
    api
      .get("/invoices")
      .then(({ data }) => setInvoices(data || []))
      .catch(() => {});
  }

  useEffect(loadInvoices, []);

  async function markPaid(id) {
    try {
      await api.patch(`/invoices/${id}/pay`);
      toast.success("Invoice marked as paid");
      loadInvoices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update invoice");
    }
  }

  const totalUnpaid = invoices
    .filter((i) => i.status === "Unpaid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Invoices</h1>
        <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
          Outstanding: ₹{totalUnpaid.toLocaleString()}
        </span>
      </div>

      <p className="text-xs text-gray-500 dark:text-slate-400">
        Invoices are generated automatically when a Dispatcher or Fleet Manager completes a trip
        with a revenue figure attached.
      </p>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Invoice No.</th>
              <th className="px-4 py-3">Trip</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No invoices yet.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {invoice.trip ? `${invoice.trip.source} → ${invoice.trip.destination}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {invoice.vehicle?.registrationNumber || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    ₹{invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {new Date(invoice.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-4 py-3">
                    {invoice.status === "Unpaid" && (
                      <button
                        onClick={() => markPaid(invoice._id)}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
