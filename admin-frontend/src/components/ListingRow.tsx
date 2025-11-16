import React from "react";
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
}

interface ListingRowProps {
    listing: Listing;
    lastReport: Report | undefined;
    reportCount: number;
}

export default function ListingRow({
    listing,
    lastReport,
    reportCount,
}: ListingRowProps) {
    return (
        <tr className="border-b">
            <td className="p-3 border">{listing.item_name}</td>
            <td className="p-3 border">{listing.user_id}</td>
            <td className="p-3 border">{reportCount}</td>
            <td className="p-3 border">{lastReport?.reported_at ?? "—"}</td>
            <td className="p-3 border">{lastReport?.reported_by ?? "—"}</td>
            <td className="p-3 border">{lastReport?.reason ?? "—"}</td>
            <td className="p-3 border">
                <Link
                    to={`/view-listing/${listing.listing_id}`}
                    className="text-blue-600 hover:underline"
                >
                    View
                </Link>
            </td>
        </tr>
    );
}
