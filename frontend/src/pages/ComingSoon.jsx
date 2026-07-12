import { FiTool } from "react-icons/fi";

export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white p-16 text-center shadow-sm dark:bg-slate-900">
      <FiTool size={28} className="mb-4 text-gray-400 dark:text-slate-500" />
      <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
        This module is on the roadmap and isn't built yet.
      </p>
    </div>
  );
}
