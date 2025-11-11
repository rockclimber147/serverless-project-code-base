import ItemCard from "@/components/ItemCard";
import MapGridToggleButton from "@/components/MapGridToggleButton";
import React from "react";
import { useState } from "react";
export default function UserDashboardGrid() {
  // TODO: replace
  const mockItems = [
    {
      id: 1,
      name: "Item1",
      price: 123,
      location: "123 Main Street, BC",
      imageUrl: "https://picsum.photos/seed/item1/300/200",
    },
    {
      id: 2,
      name: "Item2",
      price: 234,
      location: "234 Oak Avenue, BC",
      imageUrl: "https://picsum.photos/seed/item2/300/200",
    },
    {
      id: 3,
      name: "Item3",
      price: 345,
      location: "345 Pine Road, BC",
      imageUrl: "https://picsum.photos/seed/item3/300/200",
    },
    {
      id: 4,
      name: "Item4",
      price: 456,
      location: "456 Maple Street, BC",
      imageUrl: "https://picsum.photos/seed/item4/300/200",
    },
    {
      id: 5,
      name: "Item5",
      price: 567,
      location: "567 Cedar Drive, BC",
      imageUrl: "https://picsum.photos/seed/item5/300/200",
    },
    {
      id: 6,
      name: "Item6",
      price: 678,
      location: "678 Spruce Lane, BC",
      imageUrl: "https://picsum.photos/seed/item6/300/200",
    },
    {
      id: 7,
      name: "Item7",
      price: 789,
      location: "789 Willow Crescent, BC",
      imageUrl: "https://picsum.photos/seed/item7/300/200",
    },
    {
      id: 8,
      name: "Item8",
      price: 890,
      location: "890 Elm Street, BC",
      imageUrl: "https://picsum.photos/seed/item8/300/200",
    },
    {
      id: 9,
      name: "Item9",
      price: 901,
      location: "901 Birch Road, BC",
      imageUrl: "https://picsum.photos/seed/item9/300/200",
    },
    {
      id: 10,
      name: "Item10",
      price: 1012,
      location: "1012 Aspen Way, BC",
      imageUrl: "https://picsum.photos/seed/item10/300/200",
    },
  ];

  const mockItemList = mockItems.map((item) => (
    <div key={item.id}>
      <ItemCard item={item} />
    </div>
  ));
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(inputText);
    console.log("Search"); //TODO: add functionality
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
      <div className="w-full flex flex-wrap justify-center">{mockItemList}</div>
    </div>
  );
}
