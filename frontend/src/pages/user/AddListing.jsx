import React from "react";
import { ListingCRUDAPIService } from "../../services/listingCRUD";
import { useState } from "react";
export default function AddListing() {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleClear = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const listingData = {
      item_name: "POST test",
      price: 450,
      is_sold: false,
      location: "Vancouver, BC",
      latitude: 49.2827,
      longitude: -123.1207,
    };

    try {
      const result = await ListingCRUDAPIService.createListing(listingData);
      console.log("Listing created", result);
    } catch (err) {
      console.log("Failed to create listing", err);
    }
  };

  return (
    <div className="flex w-full gap-4 h-screen">
      {/* Image */}
      <div className="flex-[3] overflow-hidden bg-gray-200 flex justify-center items-center">
        {image ? (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={image}
              alt="Preview"
              className="object-cover h-full w-full"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-400 text-white px-3 py-1 rounded-lg"
            >
              Clear
            </button>
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}
      </div>

      {/* Item details */}
      <form className="m-4 flex-[1]" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-2"> Add Item Listing</h2>
        {/* Item main info */}
        <div className="mb-2 flex flex-col gap-3 mb-5">
          <input
            placeholder="Title"
            className="rounded-lg focus:border-blue-400 border w-full p-1 shadow-md"
          />
          <input
            placeholder="Price"
            type="number"
            className="rounded-lg focus:border-blue-400 border w-full p-1 shadow-md"
          />
          <input
            placeholder="Location"
            className="rounded-lg focus:border-blue-400 border w-full p-1 shadow-md p-2"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl">Details</h3>
          <textarea
            rows={6}
            placeholder="Include a description of the item."
            className="rounded-lg focus:border-blue-400 border w-full p-1 shadow-md mb-4"
          ></textarea>

          <button
            className="bg-blue-400 text-white rounded-lg px-2 py-1 hover:bg-blue-500"
            type="submit"
          >
            Save
          </button>
          <button className="border-neutral-400 border rounded-lg px-2 py-1 hover:bg-neutral-500 hover:text-white">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
