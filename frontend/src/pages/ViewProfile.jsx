import React, { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import { FaStar, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "@/services/authApi";
import { ListingAPIService } from "@/services/listingsApi"
import { useLocation } from "react-router-dom";

export default function Profile({ type = "user" }) {
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const location = useLocation();

  const defaultProfileImage = "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=1024x1024&w=is&k=20&c=ZVVVbYUtoZgPqbVSDxoltjnrW3G_4DLKYk6QZ0uu5_w=";

  function signOut() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("userId");
    navigate("/"); // redirect to login/home
  }

  const [profile, setProfileData] = useState({
    photo: defaultProfileImage,
    name: "",
    rating: 0,
    reviews: 0,
    address: "",
  });
  const passedUser = location.state?.user || null;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("idToken");

    const fetchProfile = async () => {
      try {
        if (!userId || !storedToken) {
          navigate("/");
          return;
        }
        if (type === "seller") {
          if (passedUser) {
            const name = `${passedUser.givenName ?? ""} ${passedUser.familyName ?? ""}`.trim()
              ? passedUser.givenName : passedUser.name;
            setProfileData({
              photo: passedUser?.profileImage || passedUser?.avatar || defaultProfileImage,
              name: name,
              rating: passedUser.rating ?? 0,
              reviews: passedUser.reviews ?? 0,
              address: passedUser.prefLocation ?? "",
            });
          }
          return; // STOP — do not run the logged-in user logic
        }
        const fetchedUserInfo = await getUserInfo({ id: userId });
        if (fetchedUserInfo) {
          const user = fetchedUserInfo.data;
          setProfileData(prev => ({
            ...prev,
            photo: user.profileImage || defaultProfileImage,
            name: `${user.givenName ?? ""} ${user.familyName ?? ""}`.trim(),
            address: user.prefLocation ?? "",
          }));
        }
      } catch (err) {
        console.error(err);
        navigate("/signin");
      }
    };
    fetchProfile();
  }, [navigate, passedUser]);

  useEffect(() => {
    async function fetchInitialListings() {
      console.log(passedUser);
      const userId = passedUser ? passedUser.id : localStorage.getItem("userId");;
      try {
        const data = await ListingAPIService.getUserListings(userId);
        setMyListings(data);
      } catch (err) {
        console.error("Failed to load My Listings:", err);
      }
    }
  fetchInitialListings();
  }, []);

  // TODO: Replace with live user reviews/ratings
  const reviews = [
    {
      id: 1,
      reviewer: "Alice",
      rating: 1.5,
      comment: "Great experience!",
    },
    {
      id: 2,
      reviewer: "Bob",
      rating: 4,
      comment: "Good service",
    },
  ];

  const renderStars = (count) => {
    console.log("render called")
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`inline-block ${index < count ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Profile Info */}
      <div className="flex items-start justify-between mt-6 mb-16">
        {/* LEFT SIDE: profile image + info */}
        <div className="flex items-start space-x-4">
          <img
            src={profile.photo}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />

          <div className="flex flex-col px-3">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold py-1">{profile.name}</h1>
              {type === "user" && (
                <FaPen
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => navigate("/edit-profile")}
                />
              )}
            </div>

            {type === "user" && (
              <div className="flex items-center space-x-2 mt-1">
                <span>{renderStars(profile.rating)}</span>
                <span className="text-gray-500">
                  ({profile.reviews} reviews)
                </span>
              </div>
            )}

            <p className="text-gray-600 mt-1">{profile.address}</p>
          </div>
        </div>

        {/* RIGHT SIDE: sign out button */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>

      {/* Listing Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {type === "user" ? "My Listings" : "Listings"}
          </h2>

          {type === "user" && (
            <button
              className="bg-gray-800 text-white text-sm px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => navigate("/add-listing")}
            >
              Add New Listing
            </button>
          )}
        </div>

        {/* Grid Wrapper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myListings && myListings.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Reviews Section (only for seller) */}
      {type === "seller" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex items-center justify-between border rounded p-3"
              >
                <div>
                  <p className="font-semibold">{review.reviewer}</p>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
                <div>{renderStars(review.rating)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
