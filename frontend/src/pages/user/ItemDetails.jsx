import React from "react";
import { useState, useEffect } from "react";
import SellerCard from "@/components/SellerCard";
import { FaHeart, FaRegHeart, FaPen } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReportPopUp from "@/components/ReportPopUp";
import { ListingAPIService } from "@/services/listingsApi";
import { getUserInfo } from "@/services/authApi";
import Chip from "@mui/material/Chip";

export default function ItemDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { listingId } = useParams();

  // Initialize state from location.state if available
  const [item, setItem] = useState(location.state?.item || null);
  const [modalOpen, setModalOpen] = useState(false);

  const [favourite, setFavourite] = useState(!!item?.is_favourite);
  const [user, setUser] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const isOwnListing = currentUserId && item && currentUserId === item.user_id;
  console.log(item);

  const defaultAvatar =
    "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8=";
  useEffect(() => {
    if (!item) return;
    async function getUser() {
      const authToken = localStorage.getItem("idToken");
      const res = await getUserInfo({ id: item.user_id }, authToken);
      const user = res.data;
      setUser(user);
    }
    getUser();
  }, [item]);

  useEffect(() => {
    // If item is not passed via state, fetch it from the backend

    if (!item && listingId) {
      const fetchItem = async () => {
        const fetchedItem = await ListingAPIService.getListingById(listingId);
        setItem(fetchedItem); // update the state
        setFavourite(fetchedItem.is_favourite);
      };

      fetchItem();
    }
  }, [item, listingId]);
  if (!item) {
    return (
      <div className="detail-page detail-page-container flex items-center justify-center pt-20">
        <div className="detail-card p-8">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-green-700 font-medium">Loading item...</p>
          </div>
        </div>
      </div>
    );
  }

  const date = new Date(item?.created_at).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="detail-page detail-page-container flex w-full gap-6 p-6 pt-20">
      {/* Image Section */}
      <div className="flex-[3] flex justify-center items-center">
        {item.image ? (
          <div className="detail-card overflow-hidden w-full">
            <img
              src={item?.image}
              className="object-cover max-h-[calc(100vh-5rem)] w-full"
              alt={item?.item_name}
            />
          </div>
        ) : (
          <div className="detail-card w-full h-full flex justify-center items-center bg-gradient-to-br from-green-50 to-green-100 min-h-[400px]">
            <p className="text-green-600 font-medium">No image available</p>
          </div>
        )}
      </div>

      {/* Item details */}
      <div className="flex-[1] flex flex-col">
        <div className="detail-card p-6 mb-4">
          {/* Item main info */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <h2 className="detail-title text-5xl">{item?.item_name}</h2>
                {isOwnListing && (
                  <button
                    className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                    onClick={() =>
                      navigate("/add-listing", { state: { item } })
                    }
                  >
                    <FaPen className="text-green-600 hover:text-green-700 cursor-pointer" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setFavourite(!favourite)}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                {favourite ? (
                  <FaHeart className="text-red-500 text-2xl transition-colors duration-200" />
                ) : (
                  <FaRegHeart className="text-gray-400 hover:text-red-500 text-2xl transition-colors duration-200" />
                )}
              </button>
            </div>

            <p className="detail-price text-3xl mb-2">${item?.price}</p>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full "></span>
              {item?.location || "No location available."}
            </p>
            <p className="text-gray-400 flex items-center gap-2 mt-4">
              Listed: {date || "No date available"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full gap-3 mb-6">
            {!isOwnListing && (
              <button
                className="detail-btn-primary flex-1"
                onClick={() =>
                  navigate("/chat", {
                    state: {
                      partnerId: user.id,
                      partnerName: `${user.givenName} ${user.familyName}`,
                      avatar: user.profileImage || defaultAvatar,
                      item: item,
                    },
                  })
                }
              >
                Message Seller
              </button>
            )}
            {!isOwnListing && (
              <button
                className="detail-btn-danger"
                onClick={() => setModalOpen(true)}
              >
                Report
              </button>
            )}
          </div>

          {/* Description */}
          <div className="mb-10">
            <h3 className="detail-section-title">Details</h3>
            <p className="text-gray-700 leading-relaxed">
              {item?.item_details || "No description available."}
            </p>
          </div>

          <Chip
            label={item?.tags?.length ? item.tags[0] : "No listed category"}
            className="m-1"
          ></Chip>
        </div>
        {/* Seller Card */}
        <div className="detail-card p-6">
          {user ? (
            <SellerCard user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading seller...</p>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <ReportPopUp
          open={modalOpen}
          setOpen={setModalOpen}
          listingId={item.listing_id}
        />
      )}
    </div>
  );
}
