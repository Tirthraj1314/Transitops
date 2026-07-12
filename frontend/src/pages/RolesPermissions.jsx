import { ROLE_PERMISSIONS } from "../utils/permissions";
import RoleBadge from "../components/RoleBadge";

const ROLES = Object.keys(ROLE_PERMISSIONS);
const MODULES = [
  { key: "vehicles", label: "Vehicles" },
  { key: "drivers", label: "Drivers" },
  { key: "trips", label: "Trips" },
  { key: "maintenance", label: "Maintenance" },
  { key: "fuel", label: "Fuel Logs" },
  { key: "expenses", label: "Expenses" },
];

// Users/Roles aren't in ROLE_PERMISSIONS since only Super Admin has any
// access at all - shown as fixed rows instead.
const FIXED_ROWS = [
  { label: "Users", access: { "Super Admin": "CRUD" } },
  { label: "Roles & Permissions", access: { "Super Admin": "CRUD" } },
  { label: "Audit Logs", access: { "Super Admin": "View" } },
  { label: "Companies", access: { "Super Admin": "CRUD" } },
];

const ACCESS_STYLES = {
  CRUD: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  View: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Assigned: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  No: "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-500",
};

function AccessPill({ level }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ACCESS_STYLES[level] || ACCESS_STYLES.No}`}>
      {level}
    </span>
  );
}

export default function RolesPermissions() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Roles & Permissions</h1>
      <p className="text-xs text-gray-500 dark:text-slate-400">
        Read-only view of the permission matrix from docs/SPEC.md. Enforced by the backend's
        authorization middleware on every route — this page doesn't let you edit permissions
        because they're not stored in the database; changing them means changing the route
        definitions in code.
      </p>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Module</th>
              {ROLES.map((role) => (
                <th key={role} className="px-4 py-3">
                  <RoleBadge role={role} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map(({ key, label }) => (
              <tr key={key} className="border-b last:border-0 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{label}</td>
                {ROLES.map((role) => (
                  <td key={role} className="px-4 py-3">
                    <AccessPill level={ROLE_PERMISSIONS[role][key]} />
                  </td>
                ))}
              </tr>
            ))}
            {FIXED_ROWS.map(({ label, access }) => (
              <tr key={label} className="border-b last:border-0 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{label}</td>
                {ROLES.map((role) => (
                  <td key={role} className="px-4 py-3">
                    <AccessPill level={access[role] || "No"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
