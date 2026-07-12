const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  "on-trip": "bg-blue-100 text-blue-700",
  maintenance: "bg-amber-100 text-amber-700",
  inactive: "bg-gray-100 text-gray-600",
  available: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status?.toLowerCase()] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}>
      {status || "unknown"}
    </span>
  );
}
