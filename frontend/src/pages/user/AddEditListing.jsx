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

    // Fetch coordinates
    const coordinates = await fetchCoordinates();

    const listingFormCreateData = {
      item_name: title,
      price: Number(price),
      item_details: item_details,
      location: address,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
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
      const uploadSuccess = await ListingCRUDAPIService.uploadToS3(uploadUrl, imageFile);
      if (!uploadSuccess) return;

      // Step 3: Patch listing with public URL
      await ListingCRUDAPIService.updateListing(listingId, { image: publicUrl });
    } else if (!image) {
      await ListingCRUDAPIService.updateListing(listingId, { image: "" });
    }

    if (!item) {
      navigate("/view-user-profile");
    } else {
      navigate(`/item-details/${listingId}`);
    }
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
                setImageFile(null);
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
            placeholder="Title (Required)"
            required
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg focus:border-blue-400 border w-full p-2 shadow-md"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
          <input
            value={price}
            placeholder="Price (Required)"
            type="number"
            required
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-lg focus:border-blue-400 border w-full p-2 shadow-md"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
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
            value={item_details}
            rows={6}
            placeholder="Include a description of the item."
            onChange={(e) => setItemDetails(e.target.value)}
            className="rounded-lg focus:border-blue-400 border w-full p-1 shadow-md mb-4"
          ></textarea>

          <button
            className="bg-blue-400 text-white rounded-lg px-2 py-1 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            type="submit"
            disabled={!title || !price}
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
