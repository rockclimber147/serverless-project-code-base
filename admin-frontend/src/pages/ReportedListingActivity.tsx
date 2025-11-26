import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../api/endpoints";
import ListingsTable from "../components/ListingsTable";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import Button from "../components/Button";

interface Report {
    reason: string;
    reported_at: number;
    reported_by: string;
}

interface Listing {
    listing_id: string;
    user_id: string;
    item_name: string;
    reports: Report[];
    is_sold: boolean;
    is_removed: boolean;
}

export default function ReportedListingActivity() {
    const [reportedListings, setReportedListings] = useState<Listing[]>([]);
    const [deletedListings, setDeletedListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [viewReported, setViewReported] = useState<boolean>(true);

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch(API_ENDPOINTS.reportedAndDeletedListings);
                if (!res.ok) throw new Error("Failed to fetch listings");

                const data = await res.json();
                
                const reported = (data.reported || []).filter(
                    (l: Listing) => !l.is_sold
                );

                const deleted = (data.deleted || []).filter(
                    (l: Listing) => !l.is_sold
                );

                setReportedListings(reported);
                setDeletedListings(deleted);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const activeList = viewReported ? reportedListings : deletedListings;
    const noDataMsg = viewReported
        ? "No reported listings to display."
        : "No deleted listings to display.";

    return (
        <div className="flex flex-col min-h-screen w-full container mx-auto pt-4 px-4">
            <Link to="/dashboard" className="text-blue-600 underline">
                ← Back to Admin Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-6 mt-4">
                Reported Listing Activity
            </h1>

            <div className="mb-4">
                <Button color={viewReported ? "neutral" : "lightGrey"} className="mx-1" onClick={() => setViewReported(true)}>
                    Reported Listings
                </Button>

                <Button color={!viewReported ? "neutral" : "lightGrey"} onClick={() => setViewReported(false)}>
                    Deleted Listings
                </Button>
            </div>

            {loading && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <Loading
                        message={
                            viewReported
                                ? "Loading reported listings..."
                                : "Loading deleted listings..."
                        }
                        size="sm"
                    />
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error loading listings</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            )}

            {!loading && !error && activeList.length === 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-500 text-center py-8">{noDataMsg}</p>
                </div>
            )}

            {!loading && !error && activeList.length > 0 && (
                <ListingsTable listings={activeList} />
            )}
        </div>
    );
}
