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
            <div className="admin-page pt-16">
                <div className="container mx-auto px-6 py-8">
                    <h1 className="admin-title mb-8">Admin Dashboard</h1>

                    <div className="admin-card p-6">
                        <Loading message="Loading dashboard data..." />

                        {/* Skeleton loader for dashboard cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="admin-card p-6 animate-pulse"
                                >
                                    <div className="h-5 bg-green-100 rounded w-32 mb-3"></div>
                                    <div className="h-10 bg-green-100 rounded w-20 mb-3"></div>
                                    <div className="h-4 bg-green-100 rounded w-24"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (listingsError || usersError) {
        return (
            <div className="admin-page pt-16">
                <div className="container mx-auto px-6 py-8">
                    <h1 className="admin-title mb-8">Admin Dashboard</h1>
                    <div className="admin-error">
                        <p className="font-semibold">Error loading dashboard</p>
                        <p className="text-sm mt-1">
                            {listingsError || usersError}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page pt-16">
            <div className="container mx-auto px-6 py-8">
                <h1 className="admin-title mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <DataContainer
                        textColour="text-green-600"
                        title="Total Active Listings"
                        data={activeListingsCount}
                        subtitle="Active Listings"
                    />
                    <DataContainer
                        textColour="text-gray-500"
                        title="Deleted Listings"
                        data={deletedListingsCount}
                        subtitle="Admin Removed Listings"
                    />
                    <DataContainer
                        textColour="text-emerald-600"
                        title="Total Users"
                        data={userCount}
                        subtitle="Registered Users"
                    />
                    <DataContainer
                        textColour="text-red-500"
                        title="Reported Listings"
                        data={reportedListingCount}
                        subtitle="Reported Listings"
                    />
                    <ListingsBarChart listings={listings ?? []} />
                </div>

                <div className="mb-8">
                    <button
                        onClick={() => navigate("/reported-listings")}
                        className="admin-btn-danger"
                    >
                        View Reported Listing Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
