import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Confirm from "./pages/Confirm";
import EditProfile from "./pages/EditProfile";
import Navbar from "./components/Navbar";
import Profile from "./pages/ViewProfile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/view-profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

