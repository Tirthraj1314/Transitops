import { useEffect, useState } from "react";
import { FiTruck, FiUsers, FiMap, FiDollarSign } from "react-icons/fi";
import DashboardCard from "../components/DashboardCard";
import { TrendChart, ComparisonChart } from "../components/Charts";
import api from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    vehicles: 0,
    drivers: 0,
    activeTrips: 0,
    monthlyExpense: 0,
  });
  const [tripTrend, setTripTrend] = useState([]);
  const [expenseByCategory, setExpenseByCategory] = useState([]);

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then(({ data }) => {
        setSummary(data.summary || summary);
        setTripTrend(data.tripTrend || []);
        setExpenseByCategory(data.expenseByCategory || []);
      })
      .catch(() => {
        // fleet data unavailable until the backend is connected
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Vehicles" value={summary.vehicles} icon={FiTruck} accent="blue" />
        <DashboardCard title="Total Drivers" value={summary.drivers} icon={FiUsers} accent="green" />
        <DashboardCard title="Active Trips" value={summary.activeTrips} icon={FiMap} accent="amber" />
        <DashboardCard
          title="Monthly Expense"
          value={`₹${summary.monthlyExpense.toLocaleString()}`}
          icon={FiDollarSign}
          accent="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Trips per week</h2>
          <TrendChart data={tripTrend} dataKey="trips" xKey="week" />
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Expenses by category</h2>
          <ComparisonChart data={expenseByCategory} dataKey="amount" xKey="category" />
        </div>
      </div>
    </div>
  );
}
