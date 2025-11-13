import React, { useState } from "react";
import Map from "../components/Map";
import MapGridToggleButton from "../components/MapGridToggleButton";

const SAMPLE_LISTINGS = [
    { id: 1, location: [-123.1207, 49.2827], name: "White crocs", image: "https://placehold.co/600x400", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", price: 100, link: "/" },
    { id: 2, location: [-123.1162, 49.2835], name: "Blue crocs", image: "https://placehold.co/600x400", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", price: 200, link: "/" },
    { id: 3, location: [-123.1139, 49.2819], name: "Yellow crocs", image: "https://placehold.co/600x400", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", price: 600, link: "/" },
    { id: 4, location: [-123.1149, 49.2796], name: "Green crocs", image: "https://placehold.co/600x400", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", price: 500, link: "/" },
    { id: 5, location: [-123.1115, 49.2820], name: "Purple crocs", image: "https://placehold.co/600x400", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", price: 300, link: "/" },
    { id: 6, location: [-123.1200, 49.2850], name: "Black crocs", image: "https://placehold.co/600x400", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", price: 200, link: "/" }
];

const buildPopupHTML = ({ name, price, link }) => {
    return `
        <strong>${name}</strong><br/>
        $${price}<br/>
        <a class="text-blue-500 underline" href="${link}" target="_blank">Go to listing</a>
    `;
};

const MapPage = () => {
    const [search, setSearch] = useState("");
    const [selectedListing, setSelectedListing] = useState(null);

    const toggleSelectedListing = (listing, selectedListing, setSelectedListing) => {
        if (selectedListing && selectedListing.name === listing.name) {
            setSelectedListing(null);
        } else {
            setSelectedListing(listing);
        }
    };

    const filteredListings = SAMPLE_LISTINGS.filter(listing =>
        listing.name.toLowerCase().includes(search.toLowerCase())
    );

    const locations = filteredListings.map(listing => ({
        id: listing.id,
        location: listing.location,
        popup: buildPopupHTML(listing),
        onClick: () => toggleSelectedListing(listing, selectedListing, setSelectedListing),
    }));

    return (
        <div className="w-screen h-screen relative flex">
            <div className="absolute z-[999] md:w-[30vw] w-[60%]">
                <div className="p-[1.25rem]">
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 w-full md:w-full rounded shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            {selectedListing && (
                <div className="
                    absolute z-50 bg-white shadow-lg p-4 md:pt-20
                    w-full max-h-[80vh] overflow-scroll md:w-[25vw] md:max-h-screen md:h-screen
                    bottom-0 md:bottom-auto md:left-0 md:top-0
                    transition-transform duration-300
                ">
                    <h2 className="font-bold text-lg">{selectedListing.name}</h2>
                    <p className="text-green-600 font-semibold">${selectedListing.price}</p>
                    <img className="py-2" src={selectedListing.image} alt="Product image" />
                    <p className="py-2">{selectedListing.description}</p>
                    <a
                        className="text-blue-500 underline py-2"
                        href={selectedListing.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Go to listing
                    </a>
                    <button
                        className="mt-4 text-sm text-gray-500"
                        onClick={() => setSelectedListing(null)}
                    >
                    </button>
                </div>
            )}

            <div className="absolute top-4 right-10 z-[999]">
                <MapGridToggleButton />
            </div>

            <Map
                locations={locations}
                enablePopups={true}
                selectedListing={selectedListing}
                onMapClick={() => setSelectedListing(null)}
                centerOnUser={true}
            />
        </div>
    );
};

export default MapPage;
