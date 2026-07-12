// Mirrors the Role Permission Matrix in docs/SPEC.md. This only controls
// what the UI shows/hides - the backend's authorizeRoles() calls are the
// actual enforcement boundary.
export const ROLE_PERMISSIONS = {
  "Super Admin": { vehicles: "CRUD", drivers: "CRUD", trips: "CRUD", maintenance: "CRUD", fuel: "CRUD", expenses: "CRUD" },
  "Fleet Manager": { vehicles: "CRUD", drivers: "View", trips: "View", maintenance: "CRUD", fuel: "View", expenses: "View" },
  Dispatcher: { vehicles: "View", drivers: "View", trips: "CRUD", maintenance: "View", fuel: "View", expenses: "No" },
  "Safety Officer": { vehicles: "View", drivers: "CRUD", trips: "View", maintenance: "View", fuel: "No", expenses: "No" },
  "Finance Manager": { vehicles: "View", drivers: "View", trips: "View", maintenance: "View", fuel: "CRUD", expenses: "CRUD" },
  Driver: { vehicles: "No", drivers: "No", trips: "Assigned", maintenance: "No", fuel: "No", expenses: "No" },
};

export function can(role, module, level = "CRUD") {
  const access = ROLE_PERMISSIONS[role]?.[module] || "No";
  if (level === "CRUD") return access === "CRUD";
  return access !== "No";
}
