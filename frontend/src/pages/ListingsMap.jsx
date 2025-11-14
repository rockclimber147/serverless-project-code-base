import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import LeafletMap from "../components/LeafletMap";
import MapGridToggleButton from "../components/MapGridToggleButton";
// import { ListingAPIService } from "@/services/listingsApi";

const buildPopupHTML = ({ name, price, link }) => {
    return `
        <strong>${name}</strong><br/>
        $${price}<br/>
        <a class="text-blue-500 underline" href="${link}" target="_blank">Go to listing</a>
    `;
};

const MapPage = () => {
    const [search, setSearch] = useState("");
    const [listings, setListings] = useState([]);
    const [selectedListing, setSelectedListing] = useState(null);

    useEffect(() => {
        async function fetchInitialListings() {
            try {
                // const data = await ListingAPIService.searchListings();
                const res = await fetch("https://i94mrsytqk.execute-api.us-west-2.amazonaws.com/prod/public/search");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

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
                    description: item.details || "",
                    link: `/item-details/${item.listing_id}`,
                    location: [item.longitude, item.latitude],
                }));

                setListings(normalized);
            } catch (err) {
                console.error("Failed to load listings:", err);
            }
        }
        fetchInitialListings();
    }, []);

    const toggleSelectedListing = (listing, selectedListing, setSelectedListing) => {
        if (selectedListing && selectedListing.name === listing.name) {
            setSelectedListing(null);
        } else {
            setSelectedListing(listing);
        }
    };

    const filteredListings = listings.filter(listing =>
        listing.name?.toLowerCase().includes(search.toLowerCase())
    );

    const locations = filteredListings.map(listing => ({
        id: listing.id,
        location: listing.location,
        popup: buildPopupHTML(listing),
        onClick: () => toggleSelectedListing(listing, selectedListing, setSelectedListing),
    }));

    return (
        <div className="w-screen h-screen relative flex">
            <div className="absolute z-[999] md:w-[25vw] pe-8 w-[60%] pointer-events-none">
                <div className="p-[1.25rem]">
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pointer-events-auto px-4 py-2 w-full md:w-full rounded shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            <div
                className={`
                    absolute z-[998] bg-white shadow-lg p-4 md:pt-20
                    w-full max-h-[80vh] overflow-scroll md:w-[25vw] md:max-h-screen md:h-screen
                    bottom-0 md:bottom-auto md:left-0 md:top-0
                    transition-transform duration-300
                    ${selectedListing 
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
                    <p className="text-green-600 font-semibold">${selectedListing.price}</p>
                    {selectedListing.image && <img className="py-2" src={selectedListing.image} alt="Product image" />}
                    <p className="py-2">{selectedListing.description}</p>
                    <a
                        className="text-blue-500 underline py-2"
                        href={selectedListing.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Go to listing
                    </a>
                    </>
                )}
            </div>

            <div className="absolute top-4 right-10 z-[999]">
                <MapGridToggleButton />
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
