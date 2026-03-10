// ============================================================
// pages/LostItems.jsx — Updated with live search + filters
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllLostItems, deleteLostItem } from "../services/api";
import LostItemCard from "../components/LostItemCard";
import SearchFilter from "../components/SearchFilter";
import { useAuth } from "../context/AuthContext";

const LostItems = () => {
  const { isAuthenticated } = useAuth();

  const [allItems, setAllItems] = useState([]);     // original full list from API
  const [filteredItems, setFilteredItems] = useState([]); // displayed after filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH ALL ITEMS once on page load
  // Filtering happens on the FRONTEND after fetch
  // This avoids making an API call on every keystroke
  // ============================================================
  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const response = await getAllLostItems();
      setAllItems(response.data.lostItems);
      setFilteredItems(response.data.lostItems); // show all initially
    } catch (err) {
      setError("Failed to load lost items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FILTER HANDLER — called by SearchFilter component
  // Receives: { search, category, sortBy }
  // Filters the allItems array without hitting the API
  // ============================================================
  const handleFilterChange = ({ search, category, sortBy }) => {
    let results = [...allItems]; // start with full list

    // 1. Filter by search text
    if (search.trim()) {
      const query = search.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
      );
    }

    // 2. Filter by category
    if (category && category !== "All") {
      results = results.filter((item) => item.category === category);
    }

    // 3. Sort
    if (sortBy === "newest") {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredItems(results);
  };

  // ============================================================
  // DELETE HANDLER
  // ============================================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteLostItem(id);
      // Remove from both lists
      const updated = allItems.filter((item) => item._id !== id);
      setAllItems(updated);
      setFilteredItems(filteredItems.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🔍 Lost Items</h1>
            <p className="text-gray-500 mt-1">
              Showing{" "}
              <span className="font-semibold text-red-500">
                {filteredItems.length}
              </span>{" "}
              of {allItems.length} items
            </p>
          </div>
          {isAuthenticated && (
            <Link
              to="/report-lost"
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              + Report Lost Item
            </Link>
          )}
        </div>

        {/* Search & Filter Bar */}
        <SearchFilter onFilterChange={handleFilterChange} type="lost" />

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">⏳</div>
            <p className="text-gray-500">Loading lost items...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No items match your search
            </h3>
            <p className="text-gray-500 mb-6">
              Try different keywords or reset the filters
            </p>
            {isAuthenticated && (
              <Link
                to="/report-lost"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Report Lost Item
              </Link>
            )}
          </div>
        )}

        {/* Items Grid */}
        {!loading && filteredItems.length > 0 && (
          <>
            {/* Results count */}
            <p className="text-sm text-gray-400 mb-4">
              {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} found
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <LostItemCard
                  key={item._id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default LostItems;