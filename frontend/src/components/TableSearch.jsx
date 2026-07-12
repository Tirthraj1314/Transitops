import { FiSearch } from "react-icons/fi";

export default function TableSearch({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
      <FiSearch size={16} className="text-gray-400 dark:text-slate-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none dark:text-slate-200 dark:placeholder-slate-500"
      />
    </div>
  );
}
