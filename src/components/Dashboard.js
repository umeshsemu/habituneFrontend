import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearUser } from "../store/authSlice";
import PropertyCard from "./PropertyCard";

const Dashboard = () => {
  const { username } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { userPosts } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validate that the URL username matches the logged-in user
  useEffect(() => {
    if (isAuthenticated && user) {
      const expectedUsername = user.name.toLowerCase().replace(/\s+/g, '-');
      if (username !== expectedUsername) {
        // Redirect to correct username URL
        navigate(`/${expectedUsername}/dashboard`, { replace: true });
      }
    }
  }, [username, user, isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">
            Please log in to access the dashboard
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome, {user.name}!
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Top two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center border-b pb-4">
                <div className="w-32 font-semibold text-gray-700">Name:</div>
                <div className="text-gray-900">{user.name}</div>
              </div>
              <div className="flex items-center border-b pb-4">
                <div className="w-32 font-semibold text-gray-700">Email:</div>
                <div className="text-gray-900">{user.email}</div>
              </div>
              <div className="flex items-center">
                <div className="w-32 font-semibold text-gray-700">Phone:</div>
                <div className="text-gray-900">{user.phone}</div>
              </div>
            </div>
          </div>

          {/* Right: Single Quick Action */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
            <button onClick={() => navigate(`/${username}/postad`)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 w-full">
              Post Property
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Posts</h2>
          {userPosts && userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PropertyCard key={post._id || post.id} property={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow p-6 text-gray-600">You haven’t posted any properties yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

