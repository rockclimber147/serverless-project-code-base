import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ReportedListingActivity from "./pages/ReportedListingActivity";
import ViewListing from "./pages/ViewListing";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Navbar />
                            <div className="mt-11">
                                <AdminDashboard />
                            </div>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/reported-listings"
                    element={
                        <PrivateRoute>
                            <Navbar />
                            <div className="mt-11">
                                <ReportedListingActivity />
                            </div>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/view-listing/:listingId"
                    element={
                        <PrivateRoute>
                            <Navbar />
                            <div className="mt-11">
                                <ViewListing />
                            </div>
                        </PrivateRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
