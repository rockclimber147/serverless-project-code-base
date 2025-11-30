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
        <div className="admin-card p-6 overflow-x-auto">
            <table className="admin-table min-w-full">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Seller</th>
                        <th>Total Reports</th>
                        <th>Reported At</th>
                        <th>Reported By</th>
                        <th>Reason</th>
                        <th>Actions</th>
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
