import React from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaUser, FaRegCommentDots } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-gray-800 p-2 text-white fixed top-0 left-0 w-full z-50">
      <div className="text-xl font-bold">
        <Link to="/">Crocs List</Link>
      </div>

      <div className="flex space-x-4 text-2xl">
        <Link to="/chat">
          <FaRegCommentDots className="hover:text-gray-300 text-lg" />
        </Link>
        <Link to="/favourites">
          <FaRegHeart className="hover:text-gray-300 text-lg" />
        </Link>
        <Link to="/view-user-profile">
          <FaUser className="hover:text-gray-300 text-lg" />
        </Link>
      </div>
    </nav>
  );
}
