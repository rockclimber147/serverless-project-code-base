import React from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const handleLogout = () => {
    // Placeholder for logout functionality
    window.location.href = "/login";
  };

  return (
    <nav className="flex items-center justify-between bg-gray-800 p-2 text-white fixed top-0 left-0 w-full z-50">
      <div className="text-xl font-bold">
        <Link to="/dashboard">Admin CrockList</Link>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:text-gray-300 transition"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

