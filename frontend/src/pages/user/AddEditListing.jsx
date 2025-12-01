import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListingCRUDAPIService } from "@/services/listingsUser";
import { useState, useEffect } from "react";
import DeleteModal from "@/components/DeleteModal";
import { MappingAPI } from "@/services/mapping";
import { getUserInfo } from "@/services/authApi";

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
  const [item_details, setItemDetails] = useState(item?.item_details || "");
  const [tags, setTags] = useState(item?.tags || "");

  const pageTitle = item ? "Edit Item Listing" : "Add Item Listing";

  const [errors, setErrors] = useState({ title: "", price: "" });

  const validateForm = () => {
    const newErrors = { title: "", price: "" };
    if (!title.trim()) newErrors.title = "Title is required";
    if (!price || isNaN(price) || Number(price) <= 0)
      newErrors.price = "Price must be a positive number";
    setErrors(newErrors);

    // Return true if no errors
    return !newErrors.title && !newErrors.price;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (image) {
        URL.revokeObjectURL(image);
      }
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const fetchCoordinates = async () => {
    if (address) {
      try {
        const coordinates = await MappingAPI.getCoordinates({
          address: address,
        });
        return coordinates;
      } catch (err) {
        console.error("Failed to get upload link:", err);
        return;
      }
    }
  };

  const createListing = async (listingFormCreateData) => {
    const createdListingId = await ListingCRUDAPIService.createListing(
      listingFormCreateData
    );
    console.log(createdListingId);
    return createdListingId;
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

  const updateListing = async (listingFormCreateData) => {
    const updatedData = getUpdatedFields(item, listingFormCreateData);
    console.log(updatedData)
    if (Object.keys(updatedData).length > 0) {
      await ListingCRUDAPIService.updateListing(item.listing_id, updatedData);
    }

    const listingId = item.listing_id;
    return listingId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let listingId = item?.listing_id;
    console.log(tags)

    const tagList = generateTagList(tags)

    // Fetch coordinates
    const coordinates = await fetchCoordinates();

    const listingFormCreateData = {
      item_name: title,
      price: Number(price),
      item_details: item_details,
      location: address,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
      tags: tagList,
    };

    if (!item) {
      listingId = await createListing(listingFormCreateData);
    } else {
      await updateListing(listingFormCreateData);
    }

    if (imageFile instanceof File) {
      let uploadUrl;
      let publicUrl;

      // Step 1: Get upload link
      const res = await ListingCRUDAPIService.getUploadLink(listingId);
      uploadUrl = res.upload_url;
      publicUrl = res.public_url;
      if (!res.upload_url) return;

      // Step 2: Upload to S3
      const uploadSuccess = await ListingCRUDAPIService.uploadToS3(
        uploadUrl,
        imageFile
      );
      if (!uploadSuccess) return;

      // Step 3: Patch listing with public URL
      await ListingCRUDAPIService.updateListing(listingId, {
        image: publicUrl,
      });
    } else if (!image) {
      await ListingCRUDAPIService.updateListing(listingId, { image: "" });
    }

    if (!item) {
      navigate("/view-user-profile");
    } else {
      navigate(`/item-details/${listingId}`);
    }
  };

  const generateTagList = (tags) => {
  let rawTags = [];

  // Case 1: The input is a string (assumed comma-separated)
  if (typeof tags === 'string') {
    rawTags = tags.split(',');
  } 
  // Case 2: The input is already an array of strings
  else if (Array.isArray(tags)) {
    rawTags = tags;
  } 
  // Handle other types (e.g., null, undefined, or incorrect types)
  else {
    return [];
  }

  // Common processing: trim whitespace and filter out empty strings
  const tagList = rawTags
    .map((tag) => String(tag).trim()) // Use String(tag) to handle non-string array elements if necessary
    .filter((tag) => tag !== "");

  return tagList;
};

  useEffect(() => {
    const fetchDefaultLocation = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const storedToken = localStorage.getItem("idToken");
        if (!userId || !storedToken) {
          navigate("/");
          return;
        }
        const fetchedUserInfo = await getUserInfo({ id: userId });
        if (fetchedUserInfo?.data) {
          const user = fetchedUserInfo.data;
          const location = user.prefLocation || "";
          setAddress(location);
        }
      } catch (err) {
        console.error(err);
        navigate("/signin");
      }
    };
    if (!item) {
      fetchDefaultLocation();
    }
  }, [navigate]);

  return (
    <div
      className="detail-page flex w-full gap-6 min-h-screen pt-14"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Image */}
      <div className="flex-[3] overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex justify-center items-center m-6 mr-0 rounded-2xl border border-green-200">
        {image ? (
          <div className="relative w-full h-full overflow-hidden rounded-2xl">
            <img
              src={image}
              alt="Preview"
              className="object-cover h-full w-full"
            />
            <button
              onClick={() => {
                setImage(null);
                setImageFile(null);
              }}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg transition-all"
            >
              Clear Image
            </button>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="mb-4 text-green-600">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <label className="cursor-pointer">
              <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:from-green-700 hover:to-green-800 transition-all inline-block">
                Upload Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-green-600 mt-3 text-sm">
              Click to upload a photo of your item
            </p>
          </div>
        )}
      </div>

      {/* Item details */}
      <form className="flex-[1] p-6 flex flex-col" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-green-900 mb-6">{pageTitle}</h2>

        {/* Item main info */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1.5">
              Title *
            </label>
            <input
              value={title}
              placeholder="Enter item title"
              required
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-2 border-green-200 w-full p-3 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800 mb-1.5">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-medium">
                $
              </span>
              <input
                value={price}
                placeholder="0.00"
                type="number"
                required
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-xl border-2 border-green-200 w-full p-3 pl-7 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800 mb-1.5">
              Location
            </label>
            <input
              value={address}
              placeholder="Enter pickup location"
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-xl border-2 border-green-200 w-full p-3 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="block text-sm font-medium text-green-800 mb-1.5">
            Details
          </label>
          <textarea
            value={item_details}
            rows={6}
            placeholder="Describe your item - condition, size, brand, etc."
            onChange={(e) => setItemDetails(e.target.value)}
            className="rounded-xl border-2 border-green-200 w-full p-3 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all resize-none mb-4"
          ></textarea>

          <label className="block text-sm font-medium text-green-800 mb-1.5">
            Tags
          </label>
          <textarea
            value={tags}
            rows={3}
            placeholder="Add tags separated by comma"
            onChange={(e) => setTags(e.target.value)}
            className="rounded-xl border-2 border-green-200 w-full p-3 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all resize-none mb-4"
          ></textarea>

          <div className="flex flex-col gap-3 mt-auto">
            <button
              className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl px-4 py-3 font-semibold shadow-md hover:from-green-700 hover:to-green-800 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
              type="submit"
              disabled={!title || !price}
            >
              {item ? "Save Changes" : "Create Listing"}
            </button>
            <button
              type="button"
              className="border-2 border-green-200 text-green-700 rounded-xl px-4 py-3 font-semibold hover:bg-green-50 transition-all"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            {item && (
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-3 font-semibold shadow-md transition-all"
                onClick={() => setOpenDeleteModal(true)}
              >
                Delete Listing
              </button>
            )}
          </div>
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
