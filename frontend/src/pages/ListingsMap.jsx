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
          description: item.item_details || "",
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
    <div className="w-screen h-[calc(100vh-2.75rem)] relative flex overflow-hidden">
      <div className="absolute z-[999] md:w-[25vw] pe-8 w-[60%] pointer-events-none">
        <div className="p-[1.25rem]">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pointer-events-auto px-4 py-2 w-full md:w-full rounded-lg shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div
        className={`
                    absolute z-[998] bg-gray-100 shadow-lg p-4 md:pt-20
                    w-full max-h-[80vh] overflow-scroll md:w-[25vw] md:max-h-screen md:h-screen
                    bottom-0 md:bottom-auto md:left-0 md:top-0
                    transition-transform duration-300
                    ${
                      selectedListing
                        ? "translate-y-0 md:translate-x-0"
                        : "translate-y-full md:translate-y-0 md:-translate-x-full"
                    }
                `}
      >
        <button
          className="absolute h-12 text-xl top-4 right-5 text-gray-500 hover:text-gray-800"
          onClick={() => setSelectedListing(null)}
          aria-label="Close"
        >
          ✕
        </button>

        {selectedListing && (
          <>
            <h2 className="font-bold text-lg">{selectedListing.name}</h2>
            <p className="text-green-600 font-semibold">
              ${selectedListing.price}
            </p>
            {selectedListing.image && (
              <img
                className="py-2"
                src={selectedListing.image}
                alt="Product image"
              />
            )}
            <p className="py-2">{selectedListing.description}</p>
            <button
              className="bg-gray-800 text-white text-sm mt-4 px-3 py-2 rounded hover:bg-gray-600 w-full"
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
