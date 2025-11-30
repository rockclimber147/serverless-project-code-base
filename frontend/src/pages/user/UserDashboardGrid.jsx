import ItemCard from "@/components/ItemCard";
import MapGridToggleButton from "@/components/MapGridToggleButton";
import React from "react";
import { useState, useEffect } from "react";
import { ListingAPIService } from "@/services/listingsApi";
import { SortBy } from "@/models/SortBy";

export default function UserDashboardGrid() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function fetchInitialListings() {
      const data = await ListingAPIService.searchListings(null, sortValue);
      console.log(data);
      setListings(data);
    }
    fetchInitialListings();
  }, []);

  useEffect(() => {
    console.log("Listings state updated:", listings);
  }, [listings]);

  const [inputText, setInputText] = useState("");
  const [sortValue, setSortValue] = useState(SortBy.PRICE_DESCENDING);

  const handleSearch = async (e) => {
    e.preventDefault();

    const results = await ListingAPIService.searchListings(
      inputText,
      sortValue
    );

    setListings(results);
  };

  useEffect(() => {
    const updateListingsWithSort = async () => {
      try {
        const results = await ListingAPIService.searchListings(
          inputText,
          sortValue
        );
        setListings(results);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    updateListingsWithSort();
  }, [sortValue]);

  return (
    <div className="dashboard-page flex flex-col min-h-screen w-full pt-16">
      <div className="container mx-auto px-6 pt-6">
        {/* Toggle Button */}
        <div className="mb-6">
          <MapGridToggleButton />
        </div>

        {/* Search Section */}
        <div className="relative w-full flex mb-8 ">
          <form
            onSubmit={handleSearch}
            className="w-full  rounded-xl overflow-hidden flex "
          >
            <input
              type="text"
              value={inputText}
              name="query"
              placeholder="Search for items..."
              className="dashboard-search-input flex-1 "
              onChange={(e) => setInputText(e.target.value)}
            />

            <button type="submit" className="dashboard-search-btn mr-3">
              Search
            </button>
            <select
              name="sort"
              id="sort"
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
              className="p-3 border-2 border-green-200 rounded-xl focus:outline-none w-1/4"
            >
              <option value={SortBy.PRICE_DESCENDING}>
                Price (Descending)
              </option>
              <option value={SortBy.PRICE_ASCENDING}>Price (Ascending)</option>
              <option value={SortBy.DATE_ASCENDING}>
                Date Created (Ascending)
              </option>
              <option value={SortBy.DATE_DESCENDING}>
                Date Created (Descending)
              </option>
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
