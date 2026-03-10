// ============================================================
// pages/Home.jsx
// Landing page of the portal
// ============================================================

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">
          🎓 College Lost & Found Portal
        </h1>
        <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
          Lost something on campus? Found something? 
          Help your fellow students by reporting here!
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/lost-items"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg"
          >
            🔍 View Lost Items
          </Link>
          <Link
            to="/found-items"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg"
          >
            📦 View Found Items
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Step 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              1. Report an Item
            </h3>
            <p className="text-gray-600">
              Lost something? Found something? Post details 
              with a photo and location.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              2. Smart Matching
            </h3>
            <p className="text-gray-600">
              Our AI system automatically matches lost items 
              with found items based on description.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              3. Claim & Recover
            </h3>
            <p className="text-gray-600">
              Connect with the finder and recover 
              your lost belongings safely.
            </p>
          </div>

        </div>

        {/* Register CTA */}
        {!isAuthenticated && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4 text-lg">
              Join hundreds of students already using the portal
            </p>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md"
            >
              Get Started — It's Free!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;