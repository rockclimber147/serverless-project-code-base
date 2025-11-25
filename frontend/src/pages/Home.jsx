// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const idToken = localStorage.getItem("idToken"); // check login

  function signOut() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("userId");
    navigate("/"); // redirect to login/home
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_0_10px_#00eaff]">
        Welcome to
      </h1>
      <img src="/banner.png" alt="banner.png" className="w-96 h-96" />

      {!idToken ? (
        <div className="flex gap-4">
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <button
            className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
