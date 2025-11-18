import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SellerCard(prop) {
  const { user } = prop;
  const navigate = useNavigate();
  
  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <p>Seller info:</p>
        <button
          onClick={() => navigate(`/view-seller-profile/${user.id}`, { state: { user } })}
          className="text-sm underline text-blue-600"
        >
          See seller info
        </button>
      </div>
      <div className="flex items-center">
        <FaUserCircle className="mr-2 text-4xl" />
        <p>{user.givenName} {user.familyName}</p>
      </div>
    </div>
  );
}
