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
    <div className="auth-page flex flex-col items-center justify-center px-6">
      <div className="text-center mb-8 relative z-10">
        <p className="landing-tagline mb-2">Welcome to</p>
        <h1 className="landing-hero-text mb-4">
          Crocs<span className="text-green-300">List</span>
        </h1>
        <p className="landing-tagline">Your marketplace for everything.</p>
      </div>

      <div className="mb-10 relative z-10">
        <img
          src="/banner.png"
          alt="CrocsList Banner"
          className="w-72 h-72 md:w-80 md:h-80 object-contain drop-shadow-2xl"
        />
      </div>

      {!idToken ? (
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button
            className="auth-btn-primary px-8"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
          <button
            className="auth-btn-outline"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button
            className="auth-btn-primary px-8"
            onClick={() => navigate("/user-dashboard-grid")}
          >
            Go to Dashboard
          </button>
          <button
            className="auth-btn-secondary"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
          <button
            className="auth-btn-outline border-red-400 text-red-300 hover:bg-red-400 hover:text-white"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      )}

      <p className="text-green-200/60 text-sm mt-12 relative z-10">
        Buy and sell with confidence
      </p>
    </div>
  );
}
