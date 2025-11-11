import React from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaUser, FaRegCommentDots } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-gray-800 p-4 text-white">
      <div className="text-xl font-bold">
        <Link to="/">Crocs List</Link>
      </div>

      <div className="flex space-x-4 text-2xl">
        <Link to="/chat">
          <FaRegCommentDots className="hover:text-gray-300" />
        </Link>
        <Link to="/favorites">
          <FaRegHeart className="hover:text-gray-300" />
        </Link>
        <Link to="/view-profile">
          <FaUser className="hover:text-gray-300" />
        </Link>
      </div>
    </nav>
  );
}
