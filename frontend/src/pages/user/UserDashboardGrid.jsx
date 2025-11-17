import ItemCard from "@/components/ItemCard";
import MapGridToggleButton from "@/components/MapGridToggleButton";
import React from "react";
import { useState, useEffect } from "react";
import { ListingAPIService } from "@/services/listingsApi";

export default function UserDashboardGrid() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function fetchInitialListings() {
      try {
        const data = await ListingAPIService.searchListings();
        console.log(data);
        setListings(data);
      } catch (err) {
        console.error("Failed to load listings:", err);
      }
    }
    fetchInitialListings();
  }, []);

  useEffect(() => {
    console.log("Listings state updated:", listings);
  }, [listings]);

  const [inputText, setInputText] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchText(inputText);

    try {
      const results = await ListingAPIService.searchListings(inputText);
      console.log(results);
      setListings(results);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full container mx-auto pt-4">
      <MapGridToggleButton />
      <div className="w-full flex flex-wrap justify-center mt-4">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={inputText}
            name="query"
            placeholder="Search..."
            className="p-2 rounded-l-lg w-80"
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            className="p-2 rounded-r-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>
      <h2 className="text-2xl m-4">Most Recent Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings && listings.map((item) => (
          <div key={item.id}>
            <ItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
