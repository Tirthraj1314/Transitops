import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-lg font-semibold text-gray-800">Profile</h1>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-600">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-base font-semibold text-gray-800">{user?.name || "Unknown user"}</p>
            <p className="text-sm text-gray-500">{user?.role || "Fleet operator"}</p>
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-800">{user?.email || "-"}</dd>
          </div>
          <div className="flex justify-between border-b pb-2">
            <dt className="text-gray-500">Phone</dt>
            <dd className="text-gray-800">{user?.phone || "-"}</dd>
          </div>
          <div className="flex justify-between pb-2">
            <dt className="text-gray-500">Organization</dt>
            <dd className="text-gray-800">{user?.organization || "-"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
