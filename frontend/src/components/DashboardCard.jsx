import { motion } from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";

const ACCENT_STYLES = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function DashboardCard({ title, value, icon: Icon, accent = "blue", prefix = "" }) {
  const isNumeric = Number.isFinite(Number(value));
  const animatedValue = useCountUp(isNumeric ? value : 0);
  const displayValue = isNumeric ? `${prefix}${animatedValue.toLocaleString()}` : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900"
    >
      <div>
        <p className="text-sm text-gray-500 dark:text-slate-400">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-slate-100">{displayValue}</p>
      </div>
      {Icon && (
        <div className={`rounded-lg p-3 ${ACCENT_STYLES[accent] || ACCENT_STYLES.blue}`}>
          <Icon size={22} />
        </div>
      )}
    </motion.div>
  );
}
