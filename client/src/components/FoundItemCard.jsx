// ============================================================
// components/FoundItemCard.jsx
// Reusable card to display a single found item
// ============================================================

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FoundItemCard = ({ item, onDelete, onClaim }) => {
  const { user, isAuthenticated } = useAuth();

  const isOwner = user && item.postedBy && user.id === item.postedBy._id;
  const isClaimed = item.status === "claimed";

  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">

      {/* Item Image */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
        {item.image ? (
          <img
            src={`http://localhost:5000${item.image}`}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-5xl mb-2">📦</div>
              <p className="text-sm">No image</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5">

        {/* Header — title + status */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg leading-tight">
            {item.title}
          </h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ml-2 shrink-0 ${
            isClaimed
              ? "bg-gray-100 text-gray-500"
              : "bg-emerald-100 text-emerald-600"
          }`}>
            {isClaimed ? "CLAIMED" : "AVAILABLE"}
          </span>
        </div>

        {/* Category */}
        <span className="inline-block bg-emerald-50 text-emerald-600 text-xs px-2 py-0.5 rounded-full mb-3">
          {item.category}
        </span>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Details */}
        <div className="space-y-1 mb-4">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            📍 <span>Found at: {item.location}</span>
          </p>
          {item.currentLocation && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              🏠 <span>Currently at: {item.currentLocation}</span>
            </p>
          )}
          <p className="text-xs text-gray-500 flex items-center gap-1">
            📅 <span>{formattedDate}</span>
          </p>
          {item.postedBy && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              👤 <span>Found by {item.postedBy.name}</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">

          {/* View Details */}
          <Link
            to={`/found-items/${item._id}`}
            className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-medium py-2 rounded-lg transition-colors"
          >
            View Details
          </Link>

          {/* Claim button — only for non-owners and available items */}
          {isAuthenticated && !isOwner && !isClaimed && (
            <button
              onClick={() => onClaim(item._id)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Claim 🙋
            </button>
          )}

          {/* Delete — only for owner */}
          {isOwner && (
            <button
              onClick={() => onDelete(item._id)}
              className="bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
            >
              🗑️
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default FoundItemCard;