// ============================================================
// components/SearchFilter.jsx
// Reusable search bar + category filter + sort
// Fixed: skips first render to avoid filtering empty array
// ============================================================

import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  "All",
  "Electronics",
  "Books",
  "Clothing",
  "Accessories",
  "ID/Cards",
  "Keys",
  "Bags",
  "Other",
];

const SearchFilter = ({ onFilterChange, type = "lost" }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Color theme based on type (lost = red, found = green)
  const accent =
    type === "lost"
      ? "focus:ring-red-400 border-red-200"
      : "focus:ring-emerald-400 border-emerald-200";

  // ============================================================
  // isFirstRender ref
  // useRef persists across renders WITHOUT causing re-renders
  // We use it to SKIP the first useEffect call on mount
  // because items haven't loaded from API yet at that point
  // ============================================================
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the very first automatic call on component mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Debounce: wait 400ms after user stops typing
    const debounceTimer = setTimeout(() => {
      onFilterChange({ search, category, sortBy });
    }, 400);

    // Cleanup: cancel timer if user types again within 400ms
    return () => clearTimeout(debounceTimer);
  }, [search, category, sortBy]);

  // Reset all filters to default
  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setSortBy("newest");
    // The useEffect above will trigger onFilterChange automatically
  };

  const hasActiveFilters =
    search || category !== "All" || sortBy !== "newest";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">

      {/* Search Input Row */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          {/* Search icon */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${type === "lost" ? "lost" : "found"} items...`}
            className={`w-full border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 ${accent}`}
          />
          {/* Clear search button — only shows when there's text */}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
            Category:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${accent} bg-white`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${accent} bg-white`}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Active Filter Tags + Reset */}
        <div className="flex flex-wrap gap-2 ml-auto items-center">

          {/* Category tag */}
          {category !== "All" && (
            <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              📁 {category}
              <button
                onClick={() => setCategory("All")}
                className="ml-1 hover:text-indigo-800"
              >
                ✕
              </button>
            </span>
          )}

          {/* Search tag */}
          {search && (
            <span className="bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              🔍 "{search}"
              <button
                onClick={() => setSearch("")}
                className="ml-1 hover:text-yellow-800"
              >
                ✕
              </button>
            </span>
          )}

          {/* Reset All button */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Reset all
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchFilter;
