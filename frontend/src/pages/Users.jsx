import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RoleBadge from "../components/RoleBadge";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Super Admin", "Fleet Manager", "Dispatcher", "Safety Officer", "Finance Manager", "Driver"];

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);

  function loadUsers() {
    api
      .get("/users")
      .then(({ data }) => setUsers(data || []))
      .catch(() => {
        // user data unavailable until the backend is connected
      });
  }

  useEffect(loadUsers, []);

  async function changeRole(id, role) {
    try {
      await api.patch(`/users/${id}/role`, { role });
      toast.success("Role updated");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update role");
    }
  }

  async function toggleActive(id, isActive) {
    try {
      await api.patch(`/users/${id}/status`, { isActive: !isActive });
      toast.success(isActive ? "User deactivated" : "User activated");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Users</h1>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelf = u._id === currentUser?.id;
                return (
                  <tr
                    key={u._id}
                    className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">
                      {u.name} {isSelf && <span className="text-xs text-gray-400">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={isSelf}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                        className="rounded-lg border px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {u.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!isSelf && (
                        <button
                          onClick={() => toggleActive(u._id, u.isActive)}
                          className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <RoleBadgeLegend />
    </div>
  );
}

function RoleBadgeLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {ROLES.map((role) => (
        <RoleBadge key={role} role={role} />
      ))}
    </div>
  );
}
