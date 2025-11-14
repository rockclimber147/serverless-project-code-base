import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ReportedListingActivity from "./pages/ReportedListingActivity";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <>
                            <Navbar />
                            <div className="mt-11">
                                <AdminDashboard />
                            </div>
                        </>
                    }
                />
                <Route
                    path="/reported-listings"
                    element={
                        <>
                            <Navbar />
                            <div className="mt-11">
                                <ReportedListingActivity />
                            </div>
                        </>
                    }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
