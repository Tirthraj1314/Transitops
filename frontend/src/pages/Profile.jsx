import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "../components/RoleBadge";
import api from "../services/api";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const profileForm = useForm({ defaultValues: { name: user?.name, phone: user?.phone || "" } });
  const passwordForm = useForm();

  async function onSaveProfile(values) {
    try {
      const { data } = await api.put("/auth/me", values);
      updateUser({ name: data.name, phone: data.phone });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    }
  }

  async function onChangePassword(values) {
    try {
      await api.put("/auth/change-password", values);
      toast.success("Password changed");
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    }
  }

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
            <RoleBadge role={user?.role} />
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2 dark:border-slate-800">
            <dt className="text-gray-500 dark:text-slate-400">Email</dt>
            <dd className="text-gray-800 dark:text-slate-200">{user?.email || "-"}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Edit profile</h2>
        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-3">
          <input
            placeholder="Full name"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...profileForm.register("name", { required: true })}
          />
          <input
            placeholder="Phone"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...profileForm.register("phone")}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Change password</h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-3">
          <input
            placeholder="Current password"
            type="password"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...passwordForm.register("oldPassword", { required: true })}
          />
          <input
            placeholder="New password"
            type="password"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            {...passwordForm.register("newPassword", { required: true, minLength: 6 })}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
