import React, { useState, useEffect } from "react";
import { editUser, uploadPhotoBase64 } from "@/services/authApi"

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
      // Implement getUser API if needed
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
      // 1️⃣ Upload photo first if selected
      if (photoFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result.split(",")[1]; // remove prefix
          try {
            const res = await uploadPhotoBase64({
              id: form.id,
              fileBase64: base64Data,
              filename: photoFile.name,
            });
            form.profileImage = res.s3Url; // save S3 URL
            await saveProfile();
          } catch (err) {
            console.error("Photo upload failed:", err);
            alert("Photo upload failed.");
            setLoading(false);
          }
        };
        reader.readAsDataURL(photoFile);
      } else {
        // No photo selected, just save profile
        await saveProfile();
      }
    } catch (err) {
      console.error(err);
      alert("Update failed.");
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
        className="bg-white p-8 rounded shadow-md w-96 space-y-2"
      >
        <h1 className="text-2xl font-bold">Edit Profile</h1>

        <input
          placeholder="First Name"
          value={form.givenName}
          onChange={(e) => update("givenName", e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="Last Name"
          value={form.familyName}
          onChange={(e) => update("familyName", e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="Preferred Location"
          value={form.prefLocation}
          onChange={(e) => update("prefLocation", e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-purple-500 text-white p-2 w-full rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
