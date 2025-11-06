import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Welcome Home</h1>
      <button className="bg-purple-500 text-white p-2 rounded" onClick={()=>navigate("/edit-profile")}>Edit Profile</button>
    </div>
  );
}
