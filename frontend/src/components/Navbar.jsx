import React from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaUser, FaRegCommentDots } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="navbar-themed flex items-center justify-between px-6 py-3 fixed top-0 left-0 w-full z-50">
      <div className="text-xl font-bold tracking-tight">
        <Link to="/user-dashboard-grid" className="flex items-center gap-2">
          <span className="text-white">Crocs</span>
          <span className="text-green-300">List</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <Link
          to="/chat"
          className="nav-icon-btn"
          title="Messages"
        >
          <FaRegCommentDots className="text-lg" />
        </Link>
        <Link
          to="/favourites"
          className="nav-icon-btn"
          title="Favourites"
        >
          <FaRegHeart className="text-lg" />
        </Link>
        <Link
          to="/view-user-profile"
          className="nav-icon-btn"
          title="Profile"
        >
          <FaUser className="text-lg" />
        </Link>
      </div>
    </nav>
  );
}
