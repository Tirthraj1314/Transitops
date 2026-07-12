import { useEffect, useState } from "react";
import api from "../services/api";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api
      .get("/expenses")
      .then(({ data }) => setExpenses(data.expenses || []))
      .catch(() => {
        // expense data unavailable until the backend is connected
      });
  }, []);

  const total = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Expenses</h1>
        <span className="text-sm font-medium text-gray-600">Total: ₹{total.toLocaleString()}</span>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{expense.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{expense.category}</td>
                  <td className="px-4 py-3 text-gray-600">{expense.vehicle}</td>
                  <td className="px-4 py-3 text-gray-600">₹{expense.amount?.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
