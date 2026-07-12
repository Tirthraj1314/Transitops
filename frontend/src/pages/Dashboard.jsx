import { useEffect, useState } from "react";
import {
  FiTruck,
  FiUsers,
  FiMap,
  FiActivity,
  FiDollarSign,
  FiTool,
  FiDroplet,
  FiShield,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import DashboardCard from "../components/DashboardCard";
import { ComparisonChart } from "../components/Charts";
import api from "../services/api";

const NA = "—";

function isThisMonth(dateValue) {
  if (!dateValue) return false;
  const d = new Date(dateValue);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function sum(list, pick) {
  return list.reduce((total, item) => total + (pick(item) || 0), 0);
}

function average(list, pick) {
  if (list.length === 0) return 0;
  return Math.round(sum(list, pick) / list.length);
}

function daysUntil(dateValue) {
  return Math.ceil((new Date(dateValue) - new Date()) / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role;

  const [kpis, setKpis] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [myTrips, setMyTrips] = useState([]);
  const [noDriverProfile, setNoDriverProfile] = useState(false);

  useEffect(() => {
    api
      .get("/dashboard")
      .then(({ data }) => setKpis(data))
      .catch(() => {});

    const needsVehicles = ["Super Admin", "Fleet Manager", "Dispatcher"].includes(role);
    const needsDrivers = ["Super Admin", "Safety Officer", "Dispatcher"].includes(role);
    const needsTrips = ["Super Admin", "Fleet Manager", "Dispatcher", "Finance Manager"].includes(role);
    const needsMaintenance = ["Super Admin", "Fleet Manager", "Finance Manager"].includes(role);
    const needsMoney = ["Super Admin", "Finance Manager"].includes(role);

    if (needsVehicles) api.get("/vehicles").then(({ data }) => setVehicles(data || [])).catch(() => {});
    if (needsDrivers) api.get("/drivers").then(({ data }) => setDrivers(data || [])).catch(() => {});
    if (needsTrips) api.get("/trips").then(({ data }) => setTrips(data || [])).catch(() => {});
    if (needsMaintenance) api.get("/maintenance").then(({ data }) => setMaintenance(data || [])).catch(() => {});
    if (needsMoney) {
      api.get("/expenses").then(({ data }) => setExpenses(data || [])).catch(() => {});
      api.get("/fuel").then(({ data }) => setFuelLogs(data || [])).catch(() => {});
    }
    if (role === "Driver") {
      api
        .get("/trips/my")
        .then(({ data }) => setMyTrips(data || []))
        .catch((err) => {
          if (err.response?.status === 404) setNoDriverProfile(true);
        });
    }
  }, [role]);

  const monthlyFuelCost = sum(fuelLogs.filter((f) => isThisMonth(f.date)), (f) => f.cost);
  const todayFuelCost = sum(
    fuelLogs.filter((f) => new Date(f.date).toDateString() === new Date().toDateString()),
    (f) => f.cost
  );
  const monthlyMaintenanceCost = sum(maintenance.filter((m) => isThisMonth(m.date)), (m) => m.cost);
  const monthlyExpenseCost = sum(expenses.filter((e) => isThisMonth(e.date)), (e) => e.amount);
  const monthlyRevenue = sum(
    trips.filter((t) => t.status === "Completed" && isThisMonth(t.updatedAt)),
    (t) => t.revenue
  );
  const monthlyProfit = monthlyRevenue - (monthlyFuelCost + monthlyMaintenanceCost + monthlyExpenseCost);

  const expiredLicenses = drivers.filter((d) => daysUntil(d.licenseExpiryDate) < 0).length;
  const expiringSoon = drivers.filter((d) => {
    const days = daysUntil(d.licenseExpiryDate);
    return days >= 0 && days <= 30;
  }).length;
  const suspendedDrivers = drivers.filter((d) => d.status === "Suspended").length;
  const avgSafetyScore = average(drivers, (d) => d.safetyScore);

  const todaysTrips = trips.filter(
    (t) => new Date(t.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const pendingTrips = trips.filter((t) => t.status === "Draft").length;
  const runningTrips = trips.filter((t) => t.status === "Dispatched").length;
  const completedTrips = trips.filter((t) => t.status === "Completed").length;
  const availableVehicles = vehicles.filter((v) => v.status === "Available").length;
  const availableDrivers = drivers.filter((d) => d.status === "Available").length;

  if (!kpis) return null;

  let cards = [];
  let chart = null;

  if (role === "Super Admin") {
    cards = [
      { title: "Total Companies", value: NA, icon: FiUsers, accent: "blue" },
      { title: "Total Users", value: NA, icon: FiUsers, accent: "blue" },
      { title: "Total Vehicles", value: vehicles.length, icon: FiTruck, accent: "blue" },
      { title: "Total Drivers", value: drivers.length, icon: FiUsers, accent: "green" },
      { title: "Active Trips", value: kpis.activeTrips, icon: FiMap, accent: "amber" },
      { title: "Vehicles in Maintenance", value: kpis.vehiclesInMaintenance, icon: FiTool, accent: "amber" },
      { title: "Monthly Revenue", value: monthlyRevenue, prefix: "₹", icon: FiDollarSign, accent: "green" },
      { title: "Monthly Expenses", value: monthlyExpenseCost, prefix: "₹", icon: FiDollarSign, accent: "red" },
      { title: "Fleet Utilization", value: kpis.fleetUtilization, suffix: "%", icon: FiActivity, accent: "blue" },
      { title: "System Health", value: "Operational", icon: FiShield, accent: "green" },
    ];
    chart = {
      title: "Vehicle status breakdown",
      data: [
        { label: "Available", count: kpis.availableVehicles },
        { label: "In Shop", count: kpis.vehiclesInMaintenance },
        { label: "Retired", count: kpis.retiredVehicles },
      ],
    };
  } else if (role === "Fleet Manager") {
    cards = [
      { title: "Available Vehicles", value: kpis.availableVehicles, icon: FiTruck, accent: "green" },
      { title: "Vehicles On Trip", value: kpis.activeVehicles - kpis.availableVehicles - kpis.vehiclesInMaintenance, icon: FiMap, accent: "blue" },
      { title: "In Maintenance", value: kpis.vehiclesInMaintenance, icon: FiTool, accent: "amber" },
      { title: "Retired Vehicles", value: kpis.retiredVehicles, icon: FiTruck, accent: "red" },
      { title: "Upcoming Service", value: NA, icon: FiTool, accent: "amber" },
      { title: "Fleet Utilization", value: kpis.fleetUtilization, suffix: "%", icon: FiActivity, accent: "blue" },
    ];
    chart = {
      title: "Vehicle type distribution",
      data: Object.entries(
        vehicles.reduce((acc, v) => ({ ...acc, [v.type]: (acc[v.type] || 0) + 1 }), {})
      ).map(([type, count]) => ({ type, count })),
      xKey: "type",
    };
  } else if (role === "Dispatcher") {
    cards = [
      { title: "Today's Trips", value: todaysTrips, icon: FiMap, accent: "blue" },
      { title: "Pending Trips", value: pendingTrips, icon: FiMap, accent: "amber" },
      { title: "Running Trips", value: runningTrips, icon: FiMap, accent: "blue" },
      { title: "Completed Trips", value: completedTrips, icon: FiMap, accent: "green" },
      { title: "Available Vehicles", value: availableVehicles, icon: FiTruck, accent: "green" },
      { title: "Available Drivers", value: availableDrivers, icon: FiUsers, accent: "green" },
      { title: "Delayed Trips", value: NA, icon: FiMap, accent: "red" },
    ];
    chart = {
      title: "Trips by status",
      data: [
        { label: "Draft", count: pendingTrips },
        { label: "Dispatched", count: runningTrips },
        { label: "Completed", count: completedTrips },
      ],
    };
  } else if (role === "Safety Officer") {
    cards = [
      { title: "Expired Licenses", value: expiredLicenses, icon: FiShield, accent: "red" },
      { title: "Expiring Soon (30d)", value: expiringSoon, icon: FiShield, accent: "amber" },
      { title: "Suspended Drivers", value: suspendedDrivers, icon: FiUsers, accent: "red" },
      { title: "Safety Score Average", value: avgSafetyScore, icon: FiActivity, accent: "green" },
      { title: "Incidents", value: NA, icon: FiShield, accent: "amber" },
      { title: "Violations", value: NA, icon: FiShield, accent: "amber" },
    ];
    chart = {
      title: "Driver status breakdown",
      data: [
        { label: "Available", count: drivers.filter((d) => d.status === "Available").length },
        { label: "On Trip", count: drivers.filter((d) => d.status === "On Trip").length },
        { label: "Off Duty", count: drivers.filter((d) => d.status === "Off Duty").length },
        { label: "Suspended", count: suspendedDrivers },
      ],
    };
  } else if (role === "Finance Manager") {
    cards = [
      { title: "Today's Fuel Cost", value: todayFuelCost, prefix: "₹", icon: FiDroplet, accent: "amber" },
      { title: "Monthly Fuel Cost", value: monthlyFuelCost, prefix: "₹", icon: FiDroplet, accent: "amber" },
      { title: "Maintenance Cost", value: monthlyMaintenanceCost, prefix: "₹", icon: FiTool, accent: "amber" },
      { title: "Revenue", value: monthlyRevenue, prefix: "₹", icon: FiDollarSign, accent: "green" },
      { title: "Profit", value: monthlyProfit, prefix: "₹", icon: FiDollarSign, accent: monthlyProfit >= 0 ? "green" : "red" },
      { title: "Pending Expenses", value: NA, icon: FiDollarSign, accent: "red" },
    ];
    chart = {
      title: "Expense breakdown by category",
      data: Object.entries(
        expenses.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + e.amount }), {})
      ).map(([category, amount]) => ({ category, amount })),
      xKey: "category",
      dataKey: "amount",
    };
  } else if (role === "Driver") {
    const activeMyTrip = myTrips.find((t) => ["Dispatched", "In Progress"].includes(t.status));
    cards = [
      {
        title: "Assigned Trips",
        value: myTrips.filter((t) => ["Dispatched", "In Progress"].includes(t.status)).length,
        icon: FiMap,
        accent: "blue",
      },
      {
        title: "Completed Trips",
        value: myTrips.filter((t) => t.status === "Completed").length,
        icon: FiMap,
        accent: "green",
      },
      {
        title: "Upcoming Trips",
        value: myTrips.filter((t) => t.status === "Dispatched").length,
        icon: FiMap,
        accent: "amber",
      },
      {
        title: "Assigned Vehicle",
        value: activeMyTrip?.vehicle?.registrationNumber || NA,
        icon: FiTruck,
        accent: "blue",
      },
      {
        title: "Safety Score",
        value: activeMyTrip?.driver?.safetyScore ?? myTrips[0]?.driver?.safetyScore ?? NA,
        icon: FiActivity,
        accent: "green",
      },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>

      {role === "Driver" && noDriverProfile && (
        <div className="rounded-xl bg-white p-5 text-sm text-gray-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
          No driver record is linked to this account yet. A Safety Officer needs to link it from
          the Drivers page before trip/vehicle assignment data shows up here.
        </div>
      )}

      {chart && (
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-300">{chart.title}</h2>
          <ComparisonChart data={chart.data} dataKey={chart.dataKey || "count"} xKey={chart.xKey || "label"} />
        </div>
      )}
    </div>
  );
}
