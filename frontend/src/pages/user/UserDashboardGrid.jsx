import ItemCard from "@/components/ItemCard";
import MapGridToggleButton from "@/components/MapGridToggleButton";
import React from "react";
import { useState, useEffect } from "react";
import { ListingAPIService } from "@/services/listingsApi";

export default function UserDashboardGrid() {
  // TODO: replace
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function fetchInitialListings() {
      try {
        const data = await ListingAPIService.searchListings();
        setListings(data);
      } catch (err) {
        console.error("Failed to load listings:", err);
      }
    }
    fetchInitialListings();
  }, []);

  const mockItems = [
    {
      id: 1,
      name: "Item1",
      price: 123,
      location: "123 Main Street, BC",
      imageUrl: "https://picsum.photos/seed/item1/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 2,
      name: "Item2",
      price: 234,
      location: "234 Oak Avenue, BC",
      imageUrl: "https://picsum.photos/seed/item2/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 3,
      name: "Item3",
      price: 345,
      location: "345 Pine Road, BC",
      imageUrl: "https://picsum.photos/seed/item3/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 4,
      name: "Item4",
      price: 456,
      location: "456 Maple Street, BC",
      imageUrl: "https://picsum.photos/seed/item4/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 5,
      name: "Item5",
      price: 567,
      location: "567 Cedar Drive, BC",
      imageUrl: "https://picsum.photos/seed/item5/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 6,
      name: "Item6",
      price: 678,
      location: "678 Spruce Lane, BC",
      imageUrl: "https://picsum.photos/seed/item6/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 7,
      name: "Item7",
      price: 789,
      location: "789 Willow Crescent, BC",
      imageUrl: "https://picsum.photos/seed/item7/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 8,
      name: "Item8",
      price: 890,
      location: "890 Elm Street, BC",
      imageUrl: "https://picsum.photos/seed/item8/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 9,
      name: "Item9",
      price: 901,
      location: "901 Birch Road, BC",
      imageUrl: "https://picsum.photos/seed/item9/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 10,
      name: "Item10",
      price: 1012,
      location: "1012 Aspen Way, BC",
      imageUrl: "https://picsum.photos/seed/item10/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 11,
      name: "Item1",
      price: 123,
      location: "123 Main Street, BC",
      imageUrl: "https://picsum.photos/seed/item1/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 12,
      name: "Item2",
      price: 234,
      location: "234 Oak Avenue, BC",
      imageUrl: "https://picsum.photos/seed/item2/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 13,
      name: "Item3",
      price: 345,
      location: "345 Pine Road, BC",
      imageUrl: "https://picsum.photos/seed/item3/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 14,
      name: "Item4",
      price: 456,
      location: "456 Maple Street, BC",
      imageUrl: "https://picsum.photos/seed/item4/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 15,
      name: "Item5",
      price: 567,
      location: "567 Cedar Drive, BC",
      imageUrl: "https://picsum.photos/seed/item5/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 16,
      name: "Item6",
      price: 678,
      location: "678 Spruce Lane, BC",
      imageUrl: "https://picsum.photos/seed/item6/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 17,
      name: "Item7",
      price: 789,
      location: "789 Willow Crescent, BC",
      imageUrl: "https://picsum.photos/seed/item7/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 18,
      name: "Item8",
      price: 890,
      location: "890 Elm Street, BC",
      imageUrl: "https://picsum.photos/seed/item8/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 19,
      name: "Item9",
      price: 901,
      location: "901 Birch Road, BC",
      imageUrl: "https://picsum.photos/seed/item9/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      id: 20,
      name: "Item10",
      price: 1012,
      location: "1012 Aspen Way, BC",
      imageUrl: "https://picsum.photos/seed/item10/300/200",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
  ];

  const itemList = listings.map((item) => (
    <div key={item.id}>
      <ItemCard item={item} />
    </div>
  ));
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchText(inputText);
    try {
      const results = await ListingAPIService.searchListings(inputText);
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
        {itemList}
      </div>
    </div>
  );
}
