import { useEffect, useState } from "react";
import { FiTruck, FiUsers, FiMap, FiActivity } from "react-icons/fi";
import DashboardCard from "../components/DashboardCard";
import { ComparisonChart } from "../components/Charts";
import api from "../services/api";

export default function Dashboard() {
  const [kpis, setKpis] = useState({
    activeVehicles: 0,
    availableVehicles: 0,
    vehiclesInMaintenance: 0,
    retiredVehicles: 0,
    activeTrips: 0,
    pendingTrips: 0,
    driversOnDuty: 0,
    totalDrivers: 0,
    fleetUtilization: 0,
  });

  useEffect(() => {
    api
      .get("/dashboard")
      .then(({ data }) => setKpis(data))
      .catch(() => {
        // dashboard data unavailable until the backend is connected
      });
  }, []);

  const fleetBreakdown = [
    { label: "Available", count: kpis.availableVehicles },
    { label: "In Shop", count: kpis.vehiclesInMaintenance },
    { label: "Retired", count: kpis.retiredVehicles },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Active Vehicles" value={kpis.activeVehicles} icon={FiTruck} accent="blue" />
        <DashboardCard title="Total Drivers" value={kpis.totalDrivers} icon={FiUsers} accent="green" />
        <DashboardCard title="Active Trips" value={kpis.activeTrips} icon={FiMap} accent="amber" />
        <DashboardCard
          title="Fleet Utilization"
          value={kpis.fleetUtilization}
          suffix="%"
          icon={FiActivity}
          accent="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Available Vehicles" value={kpis.availableVehicles} accent="blue" />
        <DashboardCard title="In Shop" value={kpis.vehiclesInMaintenance} accent="amber" />
        <DashboardCard title="Pending Trips" value={kpis.pendingTrips} accent="amber" />
        <DashboardCard title="Drivers On Duty" value={kpis.driversOnDuty} accent="green" />
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-300">
          Fleet status breakdown
        </h2>
        <ComparisonChart data={fleetBreakdown} dataKey="count" xKey="label" />
      </div>
    </div>
  );
}
