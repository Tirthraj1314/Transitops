import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { USE_MOCK_AUTH } from "../utils/authMode";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit({ email, password }) {
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Invalid email or password");
      } else {
        toast.error("Cannot reach the server. Is the backend running?");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm dark:bg-slate-900"
      >
        <h1 className="mb-1 text-xl font-bold text-blue-600 dark:text-blue-400">TransitOps</h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-slate-400">Sign in to manage your fleet</p>

        {USE_MOCK_AUTH && (
          <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            Demo mode — the backend isn't connected yet, so accounts are stored in this browser only.
            Try <span className="font-medium">demo@transitops.com</span> /{" "}
            <span className="font-medium">password123</span>, or create a new account.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-slate-400">
          New here?{" "}
          <Link to="/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
