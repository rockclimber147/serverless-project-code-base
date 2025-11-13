import React, { useState, useEffect } from "react";
import { editUser, uploadPhoto, getUserInfo } from "@/services/authApi"

export default function EditProfile() {
  const [form, setForm] = useState({
    id: localStorage.getItem("userId") || "",
    givenName: "",
    familyName: "",
    prefLocation: "",
    profileImage: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Optional: fetch current profile info
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const fetchedUserInfo = await getUserInfo({id: userId})
        console.log(fetchedUserInfo)
        if (fetchedUserInfo) {
          const userData = fetchedUserInfo.data
            setForm({
              givenName: userData.givenName || "",
              familyName: userData.familyName || "",
              prefLocation: userData.prefLocation || "",
              profileImage: userData.profileImage || "",
            });
        }
      } else {
        throw new Error("No UserID in local storage")
      }

    };
    fetchProfile();
  }, []);

  function update(field, val) {
    setForm({ ...form, [field]: val });
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
  }

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  try {
    if (photoFile) {
      // Get URL from Lambda
      const presignRes = await uploadPhoto({
        id: form.id,
      });
      const { upload_url, public_url } = await presignRes;
      if (!upload_url || !public_url) {
        throw new Error("Failed to get S3 URL")
      }
      // Upload the file directly to S3 using the presigned URL
      const uploadRes = await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": photoFile.type || "image/jpeg",
        },
        body: photoFile,
      });
      if (!uploadRes.ok) {
        throw new Error("Failed to upload to S3");
      }
      // Add the S3 link to the set of form data
      form.profileImage = public_url;
      await saveProfile();
    } else {
      // No photo selected, just save profile
      await saveProfile();
    }

  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Update failed.");
  } finally {
    setLoading(false);
  }
}

  async function saveProfile() {
    try {
      const updateRes = await editUser(form);
      alert(updateRes.message || "Profile updated successfully.");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Profile update failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-96 space-y-6"
    >

      <div className="flex flex-col items-center border-b pb-6 mb-6">
        <img
          src={form.profileImage || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h2 className="text-lg font-semibold">{`${form.givenName} ${form.familyName}`}</h2>
        <p className="text-gray-500">{form.prefLocation || "No location set"}</p>
      </div>

      <h1 className="text-2xl font-bold text-center">Edit Profile Info</h1>
      <div className="space-y-4">
        {/* First Name Field */}
        <div className="flex flex-col">
          <label htmlFor="givenName" className="text-sm font-semibold text-gray-700">
            First Name
          </label>
          <input
            id="givenName"
            placeholder="First Name"
            value={form.givenName}
            onChange={(e) => update("givenName", e.target.value)}
            className="border p-2 w-full mt-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="familyName" className="text-sm font-semibold text-gray-700">
            Last Name
          </label>
          <input
            id="familyName"
            placeholder="Last Name"
            value={form.familyName}
            onChange={(e) => update("familyName", e.target.value)}
            className="border p-2 w-full mt-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="prefLocation" className="text-sm font-semibold text-gray-700">
            Preferred Meeting Location
          </label>
          <input
            id="prefLocation"
            placeholder="Preferred Location"
            value={form.prefLocation}
            onChange={(e) => update("prefLocation", e.target.value)}
            className="border p-2 w-full mt-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="profileImage" className="text-sm font-semibold text-gray-700">
            Profile Image
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="border p-2 w-full mt-1"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-500 text-white p-2 w-full rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Profile"}
        </button>
      </div>
    </form>
  </div>
  );
}
