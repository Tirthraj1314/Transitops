const ROLE_STYLES = {
  "Super Admin": "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  "Fleet Manager": "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Dispatcher: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "Safety Officer": "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  "Finance Manager": "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  Driver: "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300",
};

export default function RoleBadge({ role }) {
  if (!role) return null;
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        ROLE_STYLES[role] || ROLE_STYLES.Driver
      }`}
    >
      {role}
    </span>
  );
}
