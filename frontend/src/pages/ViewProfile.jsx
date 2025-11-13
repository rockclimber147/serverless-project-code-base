import React from "react";
import ItemCard from "../components/ItemCard";
import { FaStar, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Profile({ type = "user" }) {
  const navigate = useNavigate();

  // TODO: replace
  const profile = {
    photo:
      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=3307",
    name: "John Doe",
    rating: 4,
    reviews: 12,
    address: "555 Seymour Street, Vancouver, BC",
  };

  const listings = [
    {
      id: 1,
      name: "Item1",
      price: 123,
      location: "123 Main Street, BC",
      imageUrl: "https://picsum.photos/seed/item1/300/200",
    },
    {
      id: 2,
      name: "Item2",
      price: 234,
      location: "234 Oak Avenue, BC",
      imageUrl: "https://picsum.photos/seed/item2/300/200",
    },
    {
      id: 3,
      name: "Item3",
      price: 345,
      location: "345 Pine Road, BC",
      imageUrl: "https://picsum.photos/seed/item3/300/200",
    },
    {
      id: 4,
      name: "Item4",
      price: 456,
      location: "456 Maple Street, BC",
      imageUrl: "https://picsum.photos/seed/item4/300/200",
    },
    {
      id: 5,
      name: "Item5",
      price: 567,
      location: "567 Cedar Drive, BC",
      imageUrl: "https://picsum.photos/seed/item5/300/200",
    },
    {
      id: 6,
      name: "Item6",
      price: 678,
      location: "678 Spruce Lane, BC",
      imageUrl: "https://picsum.photos/seed/item6/300/200",
    },
  ];

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
      <div className="flex items-start space-x-4 mt-6 mb-16">
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

          {type === "seller" && (
            <div className="flex items-center space-x-2 mt-1">
              <span>{renderStars(profile.rating)}</span>
              <span className="text-gray-500">({profile.reviews} reviews)</span>
            </div>
          )}

          <p className="text-gray-600 mt-1">{profile.address}</p>
        </div>
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
          {listings.map((item) => (
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
