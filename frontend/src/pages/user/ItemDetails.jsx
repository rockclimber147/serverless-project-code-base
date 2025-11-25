import React from "react";
import { useState, useEffect } from "react";
import SellerCard from "@/components/SellerCard";
import { FaHeart, FaRegHeart, FaPen } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReportPopUp from "@/components/ReportPopUp";
import { ListingAPIService } from "@/services/listingsApi";
import { getUserInfo } from "@/services/authApi";

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
  if (!item) return <p>Loading item...</p>;

  return (
    <div className="flex w-full gap-4 min-h-[calc(100vh-2.75rem)]">
      <div className="flex-[3] flex justify-center items-center">
        {item.image ? (
          <img
            src={item?.image}
            className="object-cover max-h-[calc(100vh-2.75rem)] w-full"
          />
        ) : (
          <div className="object-cover h-full w-full flex justify-center items-center bg-neutral-400">
            No image
          </div>
        )}
      </div>

      {/* Item details */}
      <div className="m-4 flex-[1]">
        {/* Item main info */}
        <div className="mb-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <h2 className="text-4xl mr-2">{item?.item_name}</h2>
              {isOwnListing && (
                <FaPen
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => navigate("/add-listing", { state: { item } })}
                />
              )}
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
          <p className="text-md">
            {item?.location || "No location available."}
          </p>
        </div>

        <div className="flex w-full gap-2 mb-4">
          {!isOwnListing && (
            <button
              className="bg-blue-500 rounded-lg px-2 py-1 text-white flex-1"
              onClick={() =>
                navigate("/chat", {
                  state: {
                    partnerId: user.id,
                    partnerName: `${user.givenName} ${user.familyName}`,
                    avatar: user.profileImage || defaultAvatar,
                  },
                })
              }
            >
              Message
            </button>
          )}
          {!isOwnListing && (
            <button
              className="bg-red-500 rounded-lg px-2 py-1 text-white w-16"
              onClick={() => setModalOpen(true)}
            >
              Report
            </button>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col  justify-between">
          <div>
            <h3 className="text-2xl">Details</h3>

            <p>{item?.details || "No description available."}</p>
          </div>

          <div>
            <hr className="border-gray-400 my-4" />
            {user ? <SellerCard user={user} /> : <p>Loading seller...</p>}
          </div>
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
