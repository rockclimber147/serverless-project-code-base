import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListingCRUDAPIService } from "@/services/listingsUser";
import { useState } from "react";
import DeleteModal from "@/components/DeleteModal";
import { MappingAPI } from "@/services/mapping";

export default function AddEditListing() {
  const location = useLocation();
  const navigate = useNavigate();

  const { item } = location.state || {};
  const [deleteModal, setOpenDeleteModal] = useState(false);
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

    let coordinates;
    let listingId;
    // Fetch coordinates
    try {
      coordinates = await MappingAPI.getCoordinates({ address: address });
      // TODO: Default to user address once backend GET user info is added
      console.log(coordinates);
    } catch (err) {
      console.error("Failed to get upload link:", err);
      return;
    }

    const currentData = {
      item_name: title,
      price: price,
      details: details,
      location: address,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      image: image,
    };

    try {
      if (item) {
        const updatedData = getUpdatedFields(item, currentData);
        await ListingCRUDAPIService.updateListing(item.listing_id, updatedData);
        listingId = item.listing_id;
      } else {
        const createdListing =
          await ListingCRUDAPIService.createListing(currentData);
        listingId = createdListing.listing_id;
      }
      if (imageFile instanceof File) {
        let uploadUrl;
        let publicUrl;

        console.log("listingid", listingId);
        // Step 1: Get upload link
        try {
          const res = await ListingCRUDAPIService.getUploadLink(listingId);
          uploadUrl = res.upload_url;
          publicUrl = res.public_url;
          console.log("Upload URL:", uploadUrl);
        } catch (err) {
          console.error("Failed to get upload link:", err);
          return;
        }
        // Step 2: Upload to S3
        try {
          await ListingCRUDAPIService.uploadToS3(uploadUrl, imageFile);
          console.log("Upload successful");
        } catch (err) {
          console.error("Failed to upload file:", err);
          return; // stop if upload fails
        }
        // Step 3: Patch listing with public URL
        try {
          await ListingCRUDAPIService.updateListing(listingId, {
            image: publicUrl,
          });
          console.log("Listing updated with image");
        } catch (err) {
          console.error("Failed to update listing:", err);
        }
      }
      if (!item) {
        navigate("/view-user-profile");
      } else {
        navigate(`/item-details/${listingId}`);
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
          {item && (
            <button
              type="button"
              className="bg-red-500 text-white border rounded-lg px-2 py-1
            hover:text-white"
              onClick={() => setOpenDeleteModal(true)}
            >
              {" "}
              Delete
            </button>
          )}
        </div>
      </form>
      {deleteModal && (
        <DeleteModal
          listingId={item.listing_id}
          open={deleteModal}
          setOpen={setOpenDeleteModal}
        />
      )}
    </div>
  );
}
