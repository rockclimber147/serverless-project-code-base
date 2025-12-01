import ItemCard from "@/components/ItemCard";
import MapGridToggleButton from "@/components/MapGridToggleButton";
import React from "react";
import { useState, useEffect } from "react";
import { ListingAPIService } from "@/services/listingsApi";
import { SortBy } from "@/models/SortBy";

export default function UserDashboardGrid() {
  const [listings, setListings] = useState([]);
  const [inputText, setInputText] = useState("");
  const [tags, setTags] = useState("");
  const [sortValue, setSortValue] = useState(SortBy.DATE_DESCENDING);

  const fetchListings = async (query, sort, tags) => {
    try {
      const data = await ListingAPIService.searchListings(query, sort, tags); // Pass tags here
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setListings([]);
    }
  };

  useEffect(() => {
    fetchListings(inputText, sortValue, tags);
  }, [tags, sortValue]);

  useEffect(() => {
    fetchListings(inputText, sortValue, tags);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchListings(inputText, sortValue, tags);
  };

  return (
    <div className="dashboard-page flex flex-col min-h-screen w-full pt-16">
      <div className="container mx-auto px-6 pt-6">
        {/* Toggle Button */}
        <div className="mb-6">
          <MapGridToggleButton />
        </div>

        {/* Search Section */}
        <div className="relative w-full flex flex-col mb-8 ">
          <form
            onSubmit={handleSearch}
            className="w-full rounded-xl overflow-hidden flex flex-col sm:flex-row gap-3" // Adjusted classes for better layout
          >
            {/* Input and Tags side-by-side on larger screens, stacked on smaller */}
            <div className="flex w-full flex-col md:flex-row ">
              <input
                type="text"
                value={inputText}
                name="query"
                placeholder="Search for items..."
                className="dashboard-search-input flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none w-full"
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                type="submit"
                className="dashboard-search-btn p-3 rounded-xl flex-shrink-0"
              >
                Search
              </button>
            </div>

            {/* Button and Sort side-by-side */}
            <div className="flex w-full sm:w-auto gap-3">
              <select
                name="clothing-filter"
                id="clothing-filter"
                className="p-3 border-2 border-green-200 rounded-xl focus:outline-none w-full sm:w-48 flex-shrink-0"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="dresses">Dresses</option>
                <option value="outerwear">Outerwear</option>
                <option value="accessories">Accessories</option>
                <option value="footwear">Footwear</option>
              </select>

              <select
                name="sort"
                id="sort"
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
                className="p-3 border-2 border-green-200 rounded-xl focus:outline-none w-full sm:w-48 flex-shrink-0"
              >
                <option value={SortBy.PRICE_DESCENDING}>
                  Price (Descending)
                </option>
                <option value={SortBy.PRICE_ASCENDING}>
                  Price (Ascending)
                </option>
                <option value={SortBy.DATE_ASCENDING}>
                  Date Created (Ascending)
                </option>
                <option value={SortBy.DATE_DESCENDING}>
                  Date Created (Descending)
                </option>
              </select>
            </div>
          </form>
        </div>

        {/* Section Title */}
        <h2 className="dashboard-section-title mb-8">Most Recent Listings</h2>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
          {listings && listings.length > 0 ? (
            listings.map((item) => (
              <div key={item.listing_id}>
                <ItemCard item={item} />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No listings found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
