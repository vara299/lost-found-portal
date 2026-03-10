// ============================================================
// pages/ItemDetail.jsx
// Shows full details of a single lost OR found item
// Works for both types based on URL
// ============================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getLostItemById, getFoundItemById } from "../services/api";

const ItemDetail = () => {
  const { id } = useParams();         // get item ID from URL
  const navigate = useNavigate();
  const location = useLocation();     // check if it's /lost-items or /found-items

  // Determine if this is a lost or found item from URL
  const isLost = location.pathname.includes("lost");

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = isLost
        ? await getLostItemById(id)
        : await getFoundItemById(id);

      setItem(isLost ? response.data.lostItem : response.data.foundItem);
    } catch (err) {
      setError("Item not found or has been deleted.");
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = item
    ? new Date(item.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-500">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-medium"
        >
          ← Back to {isLost ? "Lost" : "Found"} Items
        </button>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          {/* Item Image */}
          {item.image ? (
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.title}
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-2">{isLost ? "🔍" : "📦"}</div>
                <p>No image provided</p>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="p-8">

            {/* Title + Status */}
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{item.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isLost
                  ? "bg-red-100 text-red-600"
                  : item.status === "claimed"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-emerald-100 text-emerald-600"
              }`}>
                {item.status?.toUpperCase()}
              </span>
            </div>

            {/* Category */}
            <span className="inline-block bg-indigo-50 text-indigo-600 text-sm px-3 py-1 rounded-full mb-6">
              {item.category}
            </span>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                  {isLost ? "Lost At" : "Found At"}
                </p>
                <p className="text-gray-700 font-medium">📍 {item.location}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                  {isLost ? "Date Lost" : "Date Found"}
                </p>
                <p className="text-gray-700 font-medium">📅 {formattedDate}</p>
              </div>

              {!isLost && item.currentLocation && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                    Currently At
                  </p>
                  <p className="text-gray-700 font-medium">🏠 {item.currentLocation}</p>
                </div>
              )}

              {item.contactInfo && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                    Contact
                  </p>
                  <p className="text-gray-700 font-medium">📞 {item.contactInfo}</p>
                </div>
              )}
            </div>

            {/* Posted By */}
            {item.postedBy && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  {isLost ? "Lost" : "Found"} by{" "}
                  <span className="font-semibold text-gray-700">
                    {item.postedBy.name}
                  </span>
                  {item.postedBy.email && (
                    <span className="ml-2 text-indigo-600">
                      ({item.postedBy.email})
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Posted on {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;