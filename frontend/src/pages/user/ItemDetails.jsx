import React from "react";
import { useState } from "react";
import SellerCard from "@/components/SellerCard";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ItemDetails(props) {
  //   const { item } = props;
  // TODO: replace
  const item = {
    id: 1,
    name: "Item1",
    price: 12.99,
    location: "123 Main Street, BC",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    imageUrl: "https://picsum.photos/seed/item1/300/200",
  };

  // TODO: replace
  const user = {
    name: "Name",
  };
  const [favourite, setFavourite] = useState(false);

  return (
    <div className="flex w-full gap-4 h-screen">
      <div className="flex-[3] flex justify-center items-center">
        <img
          src={item.imageUrl}
          className="object-cover h-full object-cover w-full"
        />
      </div>

      {/* Item details */}
      <div className="m-4 flex-[1]">
        {/* Item main info */}
        <div className="mb-2">
          <div className="flex justify-between">
            <h2 className="text-4xl">{item.name}</h2>
            <button onClick={() => setFavourite(!favourite)}>
              {favourite ? (
                <FaHeart className="text-red-500 text-xl transition-colors duration-200" />
              ) : (
                <FaRegHeart className="hover:text-red-500 text-xl transition-colors duration-200" />
              )}
            </button>
          </div>
          <p className="text-2xl">${item.price}</p>
          <p className="text-md">{item.location}</p>
        </div>

        <div className="flex w-full gap-2 mb-4">
          <button className="bg-blue-500 rounded-lg px-2 py-1 text-white flex-1 ">
            <Link to="/chat">Message</Link>
          </button>
          <button className="bg-red-500 rounded-lg px-2 py-1 text-white w-16">
            Report
          </button>
        </div>

        {/* Description */}
        <div className="flex flex-col  justify-between">
          <div>
            <h3 className="text-2xl"> Details</h3>

            <p>{item.description}</p>
          </div>

          <div>
            <hr className="border-gray-400 my-4" />
            <SellerCard user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
