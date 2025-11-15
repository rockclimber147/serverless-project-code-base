import React from "react";
import { useState } from "react";
import SellerCard from "@/components/SellerCard";
import { FaHeart, FaRegHeart, FaPen } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import ReportPopUp from "@/components/ReportPopUp";

export default function ItemDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const { item } = location.state || {};
  const [modalOpen, setModalOpen] = useState(false);
  // TODO: replace
  const user = {
    name: "Name",
  };

  const [favourite, setFavourite] = useState(false);

  return (
    <div className="flex w-full gap-4 h-screen">
      <div className="flex-[3] flex justify-center items-center">
        <img src={item?.image} className="object-cover h-full w-full" />
      </div>

      {/* Item details */}
      <div className="m-4 flex-[1]">
        {/* Item main info */}
        <div className="mb-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <h2 className="text-4xl mr-2">{item?.item_name}</h2>
              <FaPen
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => navigate("/add-listing", { state: { item } })}
              />
            </div>

            <button onClick={() => setFavourite(!favourite)}>
              {favourite ? (
                <FaHeart className="text-red-500 text-xl transition-colors duration-200" />
              ) : (
                <FaRegHeart className="hover:text-red-500 text-xl transition-colors duration-200" />
              )}
            </button>
          </div>
          <p className="text-2xl">${item?.price}</p>
          <p className="text-md">{item?.location}</p>
        </div>

        <div className="flex w-full gap-2 mb-4">
          <button
            className="bg-blue-500 rounded-lg px-2 py-1 text-white flex-1"
            onClick={() => navigate("/chat")}
          >
            Message
          </button>
          <button
            className="bg-red-500 rounded-lg px-2 py-1 text-white w-16"
            onClick={() => setModalOpen(true)}
          >
            Report
          </button>
        </div>

        {/* Description */}
        <div className="flex flex-col  justify-between">
          <div>
            <h3 className="text-2xl">Details</h3>

            <p>{item?.details}</p>
          </div>

          <div>
            <hr className="border-gray-400 my-4" />
            <SellerCard user={user} />
          </div>
        </div>
      </div>

      {modalOpen && <ReportPopUp open={modalOpen} setOpen={setModalOpen} />}
    </div>
  );
}
