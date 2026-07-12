import { FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function SortableHeader({ label, sortKey, activeKey, activeDir, onSort }) {
  const isActive = sortKey === activeKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className="cursor-pointer select-none px-4 py-3 hover:text-gray-700 dark:hover:text-slate-200"
    >
      <span className="flex items-center gap-1">
        {label}
        {isActive &&
          (activeDir === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />)}
      </span>
    </th>
  );
}
