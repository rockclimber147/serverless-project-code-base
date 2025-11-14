import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen w-full container mx-auto pt-4 px-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">
                        Total Listings
                    </h2>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Active listings
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                    <p className="text-3xl font-bold text-green-600">0</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Registered users
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Reports</h2>
                    <p className="text-3xl font-bold text-red-600">0</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Pending reports
                    </p>
                </div>
            </div>

            <div className="mb-8">
                <button
                    onClick={() => navigate("/reported-listings")}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold shadow-md"
                >
                    View Reported Listing Activity
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
                <div className="text-gray-500">
                    <p>No recent activity to display.</p>
                    <p className="text-sm mt-2">
                        Backend integration will be added later.
                    </p>
                </div>
            </div>
        </div>
    );
}
