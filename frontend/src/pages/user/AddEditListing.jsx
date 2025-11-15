import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListingCRUDAPIService } from "../../services/listingCRUD";
import { useState } from "react";
export default function AddEditListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {};
  const [image, setImage] = useState(item?.image || null);
  const [title, setTitle] = useState(item?.item_name || "");
  const [price, setPrice] = useState(item?.price || "");
  const [address, setAddress] = useState(item?.location || "");
  const [details, setDetails] = useState(item?.details || "");

  const pageTitle = item ? "Edit Item Listing" : "Add Item Listing";
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

    if (item) {
      // edit existing
      await ListingCRUDAPIService.updateListing(item.id, listingData);
      console.log("Listing updated");
    } else {
      // create new
      await ListingCRUDAPIService.createListing(listingData);
      console.log("Listing created");
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
        <h2 className="text-2xl mb-2">{pageTitle}</h2>
        {/* Item main info */}
        <div className="flex flex-col gap-3 mb-5">
          <input
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg focus:border-blue-400 border w-full p-2 shadow-md"
          />
          <input
            value={price}
            placeholder="Price"
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-lg focus:border-blue-400 border w-full p-2 shadow-md"
          />
          <input
            value={address}
            placeholder="Location"
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-lg focus:border-blue-400 border w-full shadow-md p-2"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl">Details</h3>
          <textarea
            value={details}
            rows={6}
            placeholder="Include a description of the item."
            onChange={(e) => setDetails(e.target.value)}
            className="rounded-lg focus:border-blue-400 border w-full p-1 shadow-md mb-4"
          ></textarea>

          <button
            className="bg-blue-400 text-white rounded-lg px-2 py-1 hover:bg-blue-500"
            type="submit"
          >
            Save
          </button>
          <button
            className="border-neutral-400 border rounded-lg px-2 py-1 hover:bg-neutral-500 hover:text-white"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
