import ItemCard from "@/components/ItemCard";
import MapGridToggleButton from "@/components/MapGridToggleButton";
import React from "react";
import { useState, useEffect } from "react";
import { ListingAPIService } from "@/services/listingsApi";
import { SortBy } from "@/models/SortBy";

export default function UserDashboardGrid() {
  const [listings, setListings] = useState([]);
  const [searchText, setSearchText] = useState([]);

  useEffect(() => {
    async function fetchInitialListings() {
      const data = await ListingAPIService.searchListings();
      console.log(data);
      setListings(data);
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

    // TODO: get sort
    const sort = SortBy.PRICE_DESCENDING;

    const results = await ListingAPIService.searchListings(inputText, sort);
    console.log(results);
    setListings(results);
  };

  return (
    <div className="dashboard-page flex flex-col min-h-screen w-full pt-16">
      <div className="container mx-auto px-6 pt-6">
        {/* Toggle Button */}
        <div className="mb-6">
          <MapGridToggleButton />
        </div>

        {/* Search Section */}
        <div className="relative w-full flex justify-center mb-8">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-3xl rounded-xl overflow-hidden"
          >
            <input
              type="text"
              value={inputText}
              name="query"
              placeholder="Search for items..."
              className="dashboard-search-input"
              onChange={(e) => setInputText(e.target.value)}
            />

            <button type="submit" className="dashboard-search-btn mr-3">
              Search
            </button>
            <select
              name="sort"
              id="sort"
              className="absolute right-0 top-0 h-full px-2 border border-green-400 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="asc-price">Price (Ascending)</option>
              <option value="desc-price">Price (Descending)</option>
              <option value="asc-date">Date Created (Ascending)</option>
              <option value="desc-date">Date Created (Descending)</option>
            </select>
          </form>
        </div>

        {/* Section Title */}
        <h2 className="dashboard-section-title mb-8">Most Recent Listings</h2>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
          {listings &&
            listings.map((item) => (
              <div key={item.listing_id}>
                <ItemCard item={item} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
