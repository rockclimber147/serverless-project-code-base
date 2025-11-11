import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
export default function SellerCard(prop) {
  const { user } = prop;
  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <p>Seller info:</p>
        <Link
          to="/view-seller-profile"
          className="text-sm underline text-blue-600"
        >
          See seller info
        </Link>
      </div>
      <div className="flex items-center">
        <FaUserCircle className="mr-2 text-4xl" />
        <p>{user.name}</p>
      </div>
    </div>
  );
}
