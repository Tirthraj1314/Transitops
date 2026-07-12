import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Profile</h1>

      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-base font-semibold text-gray-800 dark:text-slate-100">
              {user?.name || "Unknown user"}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{user?.role || "Fleet operator"}</p>
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2 dark:border-slate-800">
            <dt className="text-gray-500 dark:text-slate-400">Email</dt>
            <dd className="text-gray-800 dark:text-slate-200">{user?.email || "-"}</dd>
          </div>
          <div className="flex justify-between border-b pb-2 dark:border-slate-800">
            <dt className="text-gray-500 dark:text-slate-400">Phone</dt>
            <dd className="text-gray-800 dark:text-slate-200">{user?.phone || "-"}</dd>
          </div>
          <div className="flex justify-between pb-2">
            <dt className="text-gray-500 dark:text-slate-400">Organization</dt>
            <dd className="text-gray-800 dark:text-slate-200">{user?.organization || "-"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
