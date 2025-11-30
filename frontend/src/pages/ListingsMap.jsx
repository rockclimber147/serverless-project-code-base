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

  const [search, setSearch] = useState("");
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    async function fetchInitialListings() {
      const data = await ListingAPIService.searchListings();
      // const res = await fetch("https://ardhu7a4ye.execute-api.us-west-2.amazonaws.com/prod/public/search");
      // if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // const data = await res.json();

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
          category: item.category,
          description: item.details || "",
          link: `/item-details/${item.listing_id}`,
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

  const filteredListings = listings.filter(
    (listing) =>
      listing.name?.toLowerCase().includes(search.toLowerCase()) ||
      listing.category?.toLowerCase().includes(search.toLowerCase())
  );

  const locations = filteredListings.map((listing) => ({
    id: listing.id,
    location: listing.location,
    popup: buildPopupHTML(listing),
    onClick: () =>
      toggleSelectedListing(listing, selectedListing, setSelectedListing),
  }));

  return (
    <div className="fixed top-14 left-0 right-0 bottom-0 flex overflow-hidden">
      <div className="absolute z-[999] md:w-[25vw] pe-8 w-[60%] pointer-events-none">
        <div className="p-[1.25rem]">
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pointer-events-auto px-4 py-3 w-full md:w-full rounded-xl shadow-lg border-2 border-green-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
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
            <h2 className="font-bold text-xl text-green-900">{selectedListing.name}</h2>
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
                navigate(`/item-details/${selectedListing.id}`, { });
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
