import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { NAV_ITEMS } from "../utils/navItems";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const matches =
    query.trim().length === 0
      ? []
      : NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goTo(to) {
    navigate(to);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
        <FiSearch size={16} className="text-gray-400 dark:text-slate-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search pages..."
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none dark:text-slate-200 dark:placeholder-slate-500"
        />
      </div>

      {open && matches.length > 0 && (
        <div className="absolute z-40 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {matches.map(({ to, label, icon: Icon }) => (
            <button
              key={to}
              onClick={() => goTo(to)}
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      )}

      {open && query.trim().length > 0 && matches.length === 0 && (
        <div className="absolute z-40 mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
          No pages match "{query}"
        </div>
      )}
    </div>
  );
}
