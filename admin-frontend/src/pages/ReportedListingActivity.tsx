import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../api/endpoints";
import ListingsTable from "../components/ListingsTable";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

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
        <div className="admin-page pt-16">
            <div className="container mx-auto px-6 py-8">
                <Link to="/dashboard" className="admin-link inline-flex items-center gap-2 mb-6">
                    <span>←</span> Back to Admin Dashboard
                </Link>

                <h1 className="admin-title mb-8">
                    Reported Listing Activity
                </h1>

                <div className="flex gap-3 mb-6">
                    <button
                        className={`admin-tab ${viewReported ? 'admin-tab-active' : 'admin-tab-inactive'}`}
                        onClick={() => setViewReported(true)}
                    >
                        Reported Listings
                    </button>

                    <button
                        className={`admin-tab ${!viewReported ? 'admin-tab-active' : 'admin-tab-inactive'}`}
                        onClick={() => setViewReported(false)}
                    >
                        Deleted Listings
                    </button>
                </div>

                {loading && (
                    <div className="admin-card p-6">
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
                    <div className="admin-error">
                        <p className="font-semibold">Error loading listings</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {!loading && !error && activeList.length === 0 && (
                    <div className="admin-empty">
                        <p>{noDataMsg}</p>
                    </div>
                )}

                {!loading && !error && activeList.length > 0 && (
                    <ListingsTable listings={activeList} />
                )}
            </div>
        </div>
    );
}
