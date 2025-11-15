import React from "react";
import { useState } from "react";
import SellerCard from "@/components/SellerCard";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import ReportPopUp from "@/components/ReportPopUp";

export default function ItemDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const { item } = location.state || {};
  const [modalOpen, setModalOpen] = useState(false);
  // TODO: replace
  const user = {
    id: "seller-id",
    name: "Name",
    photo: "https://picsum.photos/seed/200/200/200"
  };

  const [favourite, setFavourite] = useState(false);

  return (
    <div className="flex w-full gap-4 h-screen">
      <div className="flex-[3] flex justify-center items-center">
        <img src={item?.imageUrl} className="object-cover h-full w-full" />
      </div>

      {/* Item details */}
      <div className="m-4 flex-[1]">
        {/* Item main info */}
        <div className="mb-2">
          <div className="flex justify-between">
            <h2 className="text-4xl">{item?.name}</h2>
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
            onClick={() => navigate("/chat", {
              state: { partnerId: user.id, partnerName: user.name, avatar: user.photo },
            })}
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

            <p>{item?.description}</p>
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
