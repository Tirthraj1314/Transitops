const STATUS_STYLES = {
  active: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  available: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  "on trip": "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  dispatched: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  "in shop": "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  draft: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "off duty": "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300",
  inactive: "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300",
  closed: "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300",
  retired: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  suspended: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const DEFAULT_STYLE = "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300";

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status?.toLowerCase()] || DEFAULT_STYLE;
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}>
      {status || "unknown"}
    </span>
  );
}
