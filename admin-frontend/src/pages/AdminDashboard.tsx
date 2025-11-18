import DataContainer from "@/components/DataContainer";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ListingsBarChart from "@/components/ListingsBarChart";
import { useListings } from "@/hooks/useListing";
import { useUsers } from "@/hooks/useUsers";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { listings, loading: listingsLoading, error: listingsError } = useListings();
    const { users, loading: usersLoading, error: usersError } = useUsers();

    const activeListingsCount = useMemo(() => {
    return (listings || []).reduce((count: number, listings) => count + (!listings.is_removed && !listings.is_sold ? 1 : 0), 0);
    }, [listings]);

    const reportedListingCount = listings?.filter((l) => l.reports).length ?? 0;

    // This excludes admin role
    const userCount = useMemo(() => {
        return users?.body.filter((u) => u.role === "user").length ?? 0;
    }, [users]);

    if (listingsLoading || usersLoading) return <p>Loading data</p>;
    if (listingsError || usersError) return <p className="text-red-500">{listingsError || usersError}</p>;

    return (
        <div className="flex flex-col min-h-screen w-full container mx-auto pt-4 px-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DataContainer textColour="text-blue-600" title="Total Listing" data={activeListingsCount} subtitle="Active Listings"/>
                <DataContainer textColour="text-green-600" title="Total Users" data={userCount} subtitle="Registered Users"/>
                <DataContainer textColour="text-red-600" title="Reported Listings" data={reportedListingCount} subtitle="Reported Listings"/>
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
