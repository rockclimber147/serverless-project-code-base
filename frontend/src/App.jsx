import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Confirm from "./pages/Confirm";
import EditProfile from "./pages/EditProfile";
import Navbar from "./components/Navbar";
import UserDashboardGrid from "./pages/user/UserDashboardGrid";
import Favourites from "./pages/user/Favourites";
import Profile from "./pages/ViewProfile";
import ItemDetails from "./pages/user/ItemDetails";
import AddEditListing from "./pages/user/AddEditListing";
import ListingsMap from "./pages/ListingsMap";
import Chat from "./pages/user/Chat";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="mt-11">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/user-dashboard-grid" element={<UserDashboardGrid />} />
          <Route path="/view-user-profile" element={<Profile />} />
          <Route
            path="/view-seller-profile"
            element={<Profile type="seller" />}
          />
          <Route path="/item-details" element={<ItemDetails />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/add-listing" element={<AddEditListing />} />
          <Route path="/listings-map" element={<ListingsMap />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
