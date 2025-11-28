import DataContainer from "@/components/DataContainer";
import Loading from "@/components/Loading";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ListingsBarChart from "@/components/ListingsBarChart";
import { useListings } from "@/hooks/useListing";
import { useUsers } from "@/hooks/useUsers";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const {
        listings,
        loading: listingsLoading,
        error: listingsError,
    } = useListings();
    const { users, loading: usersLoading, error: usersError } = useUsers();

    const activeListingsCount = useMemo(() => {
        return (listings || []).reduce(
            (count: number, listing) =>
                count + (!listing.is_removed && !listing.is_sold ? 1 : 0),
            0
        );
    }, [listings]);

    const reportedListingCount = useMemo(() => {
        return (listings ?? []).filter(
            (l) =>
                Array.isArray(l.reports) &&
                l.reports.length > 0 &&
                !l.is_sold &&
                !l.is_removed
        ).length;
    }, [listings]);

    const deletedListingsCount = useMemo(() => {
        return (listings ?? []).reduce((count: number, listing) => count + (listing.is_removed === true ? 1 : 0), 0)
    }, [listings]);

    // This excludes admin role
    const userCount = useMemo(() => {
        return users.filter(u => u.role === "user").length;
    }, [users]);

    if (listingsLoading || usersLoading) {
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

    if (listingsError || usersError) {
        return (
            <div className="flex flex-col min-h-screen w-full container mx-auto pt-4 px-4">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error loading dashboard</p>
                    <p className="text-sm mt-1">
                        {listingsError || usersError}
                    </p>
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
                    title="Total Active Listings"
                    data={activeListingsCount}
                    subtitle="Active Listings"
                />
                <DataContainer
                    textColour="text-gray-600"
                    title="Deleted Listings"
                    data={deletedListingsCount}
                    subtitle="Admin Removed Listings"
                />
                <DataContainer
                    textColour="text-green-600"
                    title="Total Users"
                    data={userCount}
                    subtitle="Registered Users"
                />
                <DataContainer
                    textColour="text-red-600"
                    title="Reported Listings"
                    data={reportedListingCount}
                    subtitle="Reported Listings"
                />
                <ListingsBarChart listings={listings ?? []} />
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
