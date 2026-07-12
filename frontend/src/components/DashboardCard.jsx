export default function DashboardCard({ title, value, icon: Icon, accent = "blue" }) {
  const accentStyles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      {Icon && (
        <div className={`rounded-lg p-3 ${accentStyles[accent] || accentStyles.blue}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
