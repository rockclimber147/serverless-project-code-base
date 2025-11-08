import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Confirm from "./pages/Confirm";
import EditProfile from "./pages/EditProfile";
import ListingsMap from "./pages/ListingsMap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/listings-map" element={<ListingsMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

