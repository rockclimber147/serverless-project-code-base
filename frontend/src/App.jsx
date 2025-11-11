import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Confirm from "./pages/Confirm";
import EditProfile from "./pages/EditProfile";
import Navbar from "./components/Navbar";
import UserDashboardGrid from "./pages/user/UserDashboardGrid";
import Profile from "./pages/ViewProfile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="mt-12">
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
