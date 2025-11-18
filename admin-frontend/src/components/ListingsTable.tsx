import React, { useMemo } from "react";
import ListingRow from "./ListingRow";

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
}

interface ProcessedListing {
    listing: Listing;
    lastReport: Report | undefined;
    reportCount: number;
}

interface ListingsTableProps {
    listings: Listing[];
}

export default function ListingsTable({ listings }: ListingsTableProps) {
    // Memoize processed listings to avoid recalculating on every render
    const processedListings = useMemo<ProcessedListing[]>(() => {
        return listings.map((listing) => {
            const reports = listing.reports ?? [];
            const lastReport = reports[reports.length - 1];
            return {
                listing,
                lastReport,
                reportCount: reports.length,
            };
        });
    }, [listings]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3 text-left border">Item</th>
                        <th className="p-3 text-left border">Seller</th>
                        <th className="p-3 text-left border">Total Reports</th>
                        <th className="p-3 text-left border">Reported At</th>
                        <th className="p-3 text-left border">Reported By</th>
                        <th className="p-3 text-left border">Reason</th>
                        <th className="p-3 text-left border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {processedListings.map(
                        ({ listing, lastReport, reportCount }) => (
                            <ListingRow
                                key={listing.listing_id}
                                listing={listing}
                                lastReport={lastReport}
                                reportCount={reportCount}
                            />
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}
