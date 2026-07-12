import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import api from "../services/api";

export default function DriverTrips() {
  const [trips, setTrips] = useState([]);
  const [completingTrip, setCompletingTrip] = useState(null);
  const [reportingTrip, setReportingTrip] = useState(null);
  const completeForm = useForm();
  const reportForm = useForm();

  function loadTrips() {
    api
      .get("/trips/my")
      .then(({ data }) => setTrips(data || []))
      .catch((err) => {
        if (err.response?.status !== 404) {
          toast.error(err.response?.data?.message || "Could not load your trips");
        }
      });
  }

  useEffect(loadTrips, []);

  async function runAction(id, action) {
    try {
      await api.patch(`/trips/${id}/${action}`);
      toast.success(`Trip ${action === "start" ? "started" : action + "ed"}`);
      loadTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || `Could not ${action} trip`);
    }
  }

  async function submitComplete(values) {
    try {
      await api.patch(`/trips/${completingTrip._id}/complete`, {
        finalOdometer: values.finalOdometer ? Number(values.finalOdometer) : undefined,
        fuelConsumed: values.fuelConsumed ? Number(values.fuelConsumed) : undefined,
        proofNotes: values.proofNotes,
      });
      toast.success("Trip completed");
      completeForm.reset();
      setCompletingTrip(null);
      loadTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not complete trip");
    }
  }

  async function submitReport(values) {
    try {
      await api.patch(`/trips/${reportingTrip._id}/report-issue`, {
        type: values.type,
        description: values.description,
      });
      toast.success(`${values.type} reported`);
      reportForm.reset();
      setReportingTrip(null);
      loadTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not report issue");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">My Trips</h1>

      {trips.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
          No trips assigned to you.
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => (
            <div key={trip._id} className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-800 dark:text-slate-100">
                    {trip.source} → {trip.destination}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {trip.vehicle?.registrationNumber} · {trip.cargoWeight}kg
                  </p>
                </div>
                <StatusBadge status={trip.status} />
              </div>

              {trip.issueReport?.type && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                  <FiAlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>
                    {trip.issueReport.type} reported: {trip.issueReport.description}
                  </span>
                </div>
              )}

              {trip.status === "Dispatched" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => runAction(trip._id, "start")}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Accept & Start
                  </button>
                  <button
                    onClick={() => runAction(trip._id, "reject")}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}

              {trip.status === "In Progress" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setCompletingTrip(trip)}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                  >
                    Complete Trip
                  </button>
                  <button
                    onClick={() => {
                      reportForm.reset({ type: "Breakdown" });
                      setReportingTrip(trip);
                    }}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Report Breakdown
                  </button>
                  <button
                    onClick={() => {
                      reportForm.reset({ type: "Accident" });
                      setReportingTrip(trip);
                    }}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Report Accident
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={!!completingTrip} title="Complete Trip" onClose={() => setCompletingTrip(null)}>
        <form onSubmit={completeForm.handleSubmit(submitComplete)} className="space-y-3">
          <input
            placeholder="Final odometer (km)"
            type="number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...completeForm.register("finalOdometer")}
          />
          <input
            placeholder="Fuel used (liters)"
            type="number"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...completeForm.register("fuelConsumed")}
          />
          <textarea
            placeholder="Delivery proof / customer signature note"
            rows={3}
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...completeForm.register("proofNotes")}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Complete Trip
          </button>
        </form>
      </Modal>

      <Modal
        open={!!reportingTrip}
        title={`Report ${reportForm.watch("type") || "Issue"}`}
        onClose={() => setReportingTrip(null)}
      >
        <form onSubmit={reportForm.handleSubmit(submitReport)} className="space-y-3">
          <input type="hidden" {...reportForm.register("type")} />
          <textarea
            placeholder="What happened?"
            rows={4}
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...reportForm.register("description", { required: true })}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Submit Report
          </button>
        </form>
      </Modal>
    </div>
  );
}
