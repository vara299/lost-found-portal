// ============================================================
// pages/FoundItems.jsx — Updated with live search + filters
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllFoundItems, deleteFoundItem } from "../services/api";
import FoundItemCard from "../components/FoundItemCard";
import SearchFilter from "../components/SearchFilter";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const FoundItems = () => {
  const { isAuthenticated } = useAuth();

  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const response = await getAllFoundItems();
      setAllItems(response.data.foundItems);
      setFilteredItems(response.data.foundItems);
    } catch (err) {
      setError("Failed to load found items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FILTER HANDLER
  // Same logic as LostItems but also filters by claim status
  // ============================================================
  const handleFilterChange = ({ search, category, sortBy }) => {
    let results = [...allItems];

    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (category && category !== "All") {
      results = results.filter((item) => item.category === category);
    }

    // Sort
    if (sortBy === "newest") {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredItems(results);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteFoundItem(id);
      const updated = allItems.filter((item) => item._id !== id);
      setAllItems(updated);
      setFilteredItems(filteredItems.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item");
    }
  };

  const handleClaim = async (id) => {
    if (!window.confirm("Are you sure you want to claim this item?")) return;

    try {
      await API.put(`/found/${id}/claim`);
      // Update status in both arrays
      const updateStatus = (items) =>
        items.map((item) =>
          item._id === id ? { ...item, status: "claimed" } : item
        );
      setAllItems(updateStatus(allItems));
      setFilteredItems(updateStatus(filteredItems));
      alert("✅ Item claimed! Contact the finder to collect it.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to claim item");
    }
  };

  // Count available vs claimed items
  const availableCount = filteredItems.filter(
    (item) => item.status === "available"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📦 Found Items</h1>
            <p className="text-gray-500 mt-1">
              Showing{" "}
              <span className="font-semibold text-emerald-500">
                {filteredItems.length}
              </span>{" "}
              of {allItems.length} items
              {availableCount > 0 && (
                <span className="ml-2 bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full">
                  {availableCount} available
                </span>
              )}
            </p>
          </div>
          {isAuthenticated && (
            <Link
              to="/report-found"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              + Report Found Item
            </Link>
          )}
        </div>

        {/* Search & Filter Bar */}
        <SearchFilter onFilterChange={handleFilterChange} type="found" />

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">⏳</div>
            <p className="text-gray-500">Loading found items...</p>
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
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No items match your search
            </h3>
            <p className="text-gray-500 mb-6">
              Try different keywords or reset the filters
            </p>
            {isAuthenticated && (
              <Link
                to="/report-found"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Report Found Item
              </Link>
            )}
          </div>
        )}

        {/* Items Grid */}
        {!loading && filteredItems.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} found
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <FoundItemCard
                  key={item._id}
                  item={item}
                  onDelete={handleDelete}
                  onClaim={handleClaim}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default FoundItems;
