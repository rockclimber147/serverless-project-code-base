import DataContainer from "@/components/DataContainer";
import Loading from "@/components/Loading";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../api/endpoints";

interface Report {
    reason: string;
    reported_at: number;
    reported_by: string;
}

interface Listing {
    listing_id: string;
    user_id: string;
    item_name: string;
    is_sold: boolean;
    is_removed: boolean;
    reports: Report[];
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [listings, setListings] = useState<Listing[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const activeListingsCount = useMemo(() => {
        return (listings || []).reduce(
            (count: number, listing: Listing) =>
                count + (!listing.is_removed && !listing.is_sold ? 1 : 0),
            0
        );
    }, [listings]);

    const reportedListingCount =
        listings?.filter((l: Listing) => l.reports).length ?? 0;

    useEffect(() => {
        async function load() {
            try {
                const resListings = await fetch(API_ENDPOINTS.viewAllListings);

                if (!resListings.ok) throw new Error("Failed to load listings");

                const resListingsData = await resListings.json();
                setListings(resListingsData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen w-full container mx-auto pt-4 px-4">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <Loading message="Loading dashboard data..." />

                    {/* Skeleton loader for dashboard cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-gray-50 p-6 rounded-lg shadow-md animate-pulse"
                            >
                                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-10 bg-gray-200 rounded w-16 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                        ))}
                    </div>

                    {/* Skeleton loader for button */}
                    <div className="mb-8">
                        <div className="h-12 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen w-full container mx-auto pt-4 px-4">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error loading dashboard</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full container mx-auto pt-4 px-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DataContainer
                    textColour="text-blue-600"
                    title="Total Listing"
                    data={activeListingsCount}
                    subtitle="Active Listings"
                />
                <DataContainer
                    textColour="text-green-600"
                    title="Total Users"
                    data={0}
                    subtitle="Registered Users"
                />
                <DataContainer
                    textColour="text-red-600"
                    title="Reported Listings"
                    data={reportedListingCount}
                    subtitle="Reported Listings"
                />
            </div>

            <div className="mb-8">
                <button
                    onClick={() => navigate("/reported-listings")}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold shadow-md"
                >
                    View Reported Listing Activity
                </button>
            </div>
        </div>
    );
}
