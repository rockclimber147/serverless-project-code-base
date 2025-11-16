import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListingCRUDAPIService } from "@/services/listingsUser";
import { useState } from "react";
import DeleteModal from "@/components/DeleteModal";

export default function AddEditListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteModal, setOpenDeleteModal] = useState(false);
  const { item } = location.state || {};
  const [image, setImage] = useState(item?.image || null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState(item?.item_name || "");
  const [price, setPrice] = useState(item?.price || "");
  const [address, setAddress] = useState(item?.location || "");
  const [details, setDetails] = useState(item?.details || "");

  const pageTitle = item ? "Edit Item Listing" : "Add Item Listing";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  function getUpdatedFields(original, current) {
    const updated = {};
    Object.keys(current).forEach((key) => {
      // Only include fields that are different
      if (current[key] !== original[key]) {
        updated[key] = current[key];
      }
    });
    return updated;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentData = {
      item_name: title,
      price: price,
      details: details,
      location: address,
      image: image,
    };
    let listingId;
    console.log("current Data", currentData);
    try {
      if (item) {
        const updatedData = getUpdatedFields(item, currentData);
        await ListingCRUDAPIService.updateListing(item.id, updatedData);
        listingId = item.id;
      } else {
        const createdListing =
          await ListingCRUDAPIService.createListing(currentData);
        listingId = createdListing.id;
      }
      if (imageFile instanceof File) {
        const { upload_url, public_url } =
          await ListingCRUDAPIService.getUploadLink(listingId);
        await ListingCRUDAPIService.uploadToS3(upload_url, imageFile);

        // Patch the listing with the public_url
        await ListingCRUDAPIService.updateListing(listingId, {
          image: public_url,
        });
      }
    } catch (err) {
      console.error("Failed to save listing:", err);
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
              onClick={() => {
                setImage(null);
              }}
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
            type="button"
            className="border-neutral-400 border rounded-lg px-2 py-1 hover:bg-neutral-500 hover:text-white"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="button"
            className="bg-red-500 text-white border rounded-lg px-2 py-1
            hover:text-white"
            onClick={() => setOpenDeleteModal(true)}
          >
            {" "}
            Delete
          </button>
        </div>
      </form>
      {deleteModal && (
        <DeleteModal
          listingId={item.id}
          open={deleteModal}
          setOpen={setOpenDeleteModal}
        />
      )}
    </div>
  );
}
