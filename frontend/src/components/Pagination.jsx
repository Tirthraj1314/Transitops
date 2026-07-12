import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ page, totalPages, totalCount, onPageChange }) {
  if (totalCount === 0) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500 dark:text-slate-400">
      <span>
        Page {page} of {totalPages} · {totalCount} total
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-lg border p-1.5 disabled:opacity-40 dark:border-slate-700"
        >
          <FiChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-lg border p-1.5 disabled:opacity-40 dark:border-slate-700"
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
