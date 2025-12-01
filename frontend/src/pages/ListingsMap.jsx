import React, { useState, useEffect } from "react";
// import Map from "../components/Map";
import LeafletMap from "../components/LeafletMap";
import MapGridToggleButton from "../components/MapGridToggleButton";
import { ListingAPIService } from "@/services/listingsApi";
import { useNavigate } from "react-router-dom";

const buildPopupHTML = ({ name, price, link }) => {
  return `
         <strong>${name}</strong><br/>
         $${price}<br/>
         <a class="text-blue-500 underline" href="${link}">Go to listing</a>
     `;
};

const MapPage = () => {
  const navigate = useNavigate();

  // New state for tags search input
  const [search, setSearch] = useState("");
  const [tagsSearch, setTagsSearch] = useState("");
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    async function fetchInitialListings() {
      // NOTE: You are calling searchListings() with no arguments, which fetches ALL listings.
      // If you want the map to only show filtered results on load, you would need to pass
      // search and tagsSearch to searchListings here, but we will stick to client-side filtering
      // as implemented in the original code.
      const data = await ListingAPIService.searchListings();

      const normalized = data
        .filter(
          (item) =>
            typeof item.latitude === "number" &&
            typeof item.longitude === "number" &&
            item.latitude !== 0 &&
            item.longitude !== 0
        )
        .map((item) => ({
          id: item.listing_id,
          name: item.item_name,
          price: item.price,
          image: item.image,
          tags: item.tags,
          tagsCombined: item.tags?.join(" ").toLowerCase() || "", // Safely handle undefined tags
          description: item.item_details || "",
          link: `/item-details/${item.listing_id}`,
          // Leaflet expects [latitude, longitude], but your original code mapped to [longitude, latitude].
          // Assuming LeafletMap component handles this based on your original map:
          location: [item.longitude, item.latitude],
        }));

      setListings(normalized);
    }
    fetchInitialListings();
  }, []);

  const toggleSelectedListing = (
    listing,
    selectedListing,
    setSelectedListing
  ) => {
    if (selectedListing && selectedListing.id === listing.id) {
      setSelectedListing(null);
    } else {
      setSelectedListing(listing);
    }
  };

  // --- Filtering Logic Update ---
  const filteredListings = listings.filter((listing) => {
    // 1. Basic text search (name/tagsCombined)
    const textMatch =
      listing.name?.toLowerCase().includes(search.toLowerCase()) ||
      listing.tagsCombined?.toLowerCase().includes(search.toLowerCase());

    // 2. Tags search
    const tagSearchTerms = tagsSearch
      .toLowerCase()
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // If no tags are searched, this condition is automatically true.
    // If tags are searched, check if ALL search tags are included in the listing's tags.
    const tagsMatch = tagSearchTerms.every((searchTerm) =>
      listing.tagsCombined?.includes(searchTerm)
    );

    return textMatch && tagsMatch;
  });
  // ------------------------------

  const locations = filteredListings.map((listing) => ({
    id: listing.id,
    location: listing.location,
    popup: buildPopupHTML(listing),
    onClick: () =>
      toggleSelectedListing(listing, selectedListing, setSelectedListing),
  }));

  return (
    <div className="fixed top-14 left-0 right-0 bottom-0 flex overflow-hidden">
      <div className="absolute z-[999] md:w-[50vw] pe-8 w-[90%] pointer-events-none">
        <div className="p-[1.25rem] flex flex-col sm:flex-row gap-3">
          {/* Main Search Input */}
          <input
            type="text"
            placeholder="Search name or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pointer-events-auto px-4 py-3 flex-1 rounded-xl shadow-lg border-2 border-green-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />

          {/* New Tags Search Input */}
          <input
            type="text"
            placeholder="Search tags (e.g., tech, book)"
            value={tagsSearch}
            onChange={(e) => setTagsSearch(e.target.value)}
            className="pointer-events-auto px-4 py-3 flex-1 rounded-xl shadow-lg border-2 border-green-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />
        </div>
      </div>

      <div
        className={`
            absolute z-[998] bg-white shadow-xl p-5 pt-20 md:pt-20
            w-full max-h-[80vh] overflow-scroll md:w-[25vw] md:max-h-full md:h-full
            bottom-0 md:bottom-0 md:left-0 md:top-0
            transition-transform duration-300 border-r border-green-100
            ${
              selectedListing
                ? "translate-y-0 md:translate-x-0"
                : "translate-y-full md:translate-y-0 md:-translate-x-full"
            }
          `}
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <button
          className="absolute h-10 w-10 flex items-center justify-center text-lg top-20 md:top-20 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setSelectedListing(null)}
          aria-label="Close"
        >
          ✕
        </button>

        {selectedListing && (
          <>
            <h2 className="font-bold text-xl text-green-900">
              {selectedListing.name}
            </h2>
            <p className="text-green-600 font-semibold text-lg mt-1">
              ${selectedListing.price}
            </p>
            {selectedListing.image && (
              <img
                className="py-3 rounded-lg"
                src={selectedListing.image}
                alt="Product image"
              />
            )}
            <p className="py-2 text-gray-600">{selectedListing.description}</p>
            <button
              className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold mt-4 px-4 py-3 rounded-xl hover:from-green-700 hover:to-green-800 w-full shadow-md transition-all hover:shadow-lg"
              onClick={() => {
                navigate(`/item-details/${selectedListing.id}`, {});
              }}
              rel="noreferrer"
            >
              View Listing
            </button>
          </>
        )}
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 container flex justify-end pointer-events-none z-[9999]">
        <div className="pointer-events-auto">
          <MapGridToggleButton />
        </div>
      </div>

      <LeafletMap
        locations={locations}
        enablePopups={false}
        selectedListing={selectedListing}
        onMapClick={() => setSelectedListing(null)}
        centerOnUser={true}
      />
    </div>
  );
};

export default MapPage;
