import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../api/endpoints";
import ListingsTable from "../components/ListingsTable";
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

export default function ReportedListingActivity() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Convert DynamoDB AttributeValue format
    function parseDynamo(item: any): Listing {
        const output: any = {};

        for (const key in item) {
            const value = item[key];

            if (value?.S !== undefined) output[key] = value.S;
            else if (value?.N !== undefined) output[key] = Number(value.N);
            else if (value?.BOOL !== undefined) output[key] = value.BOOL;
            else if (value?.L !== undefined)
                output[key] = value.L.map(
                    (x: any) => x.M && parseDynamo(x.M)
                ).filter(Boolean);
            else if (value?.M !== undefined) output[key] = parseDynamo(value.M);
            else output[key] = value;
        }

        return output as Listing;
    }

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch(API_ENDPOINTS.reportedListings);

                if (!res.ok) throw new Error("Failed to fetch listings");

                const data = await res.json();

                const normalized =
                    data[0] && data[0].listing_id?.S
                        ? data.map((d: any) => parseDynamo(d))
                        : data;

                setListings(normalized);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen w-full container mx-auto pt-4 px-4">
            <Link to="/dashboard" className="text-blue-600 underline">
            ← Back to Reported Listings
            </Link>
            <h1 className="text-3xl font-bold mb-6 mt-4">
                Reported Listing Activity
            </h1>

            {loading && (
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <div className="flex flex-col items-center justify-center py-8 mb-6">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
                        <p className="text-gray-600">
                            Loading reported listings...
                        </p>
                    </div>
                    {/* Skeleton loader matching table structure */}
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left border">Item</th>
                                <th className="p-3 text-left border">Seller</th>
                                <th className="p-3 text-left border">
                                    Total Reports
                                </th>
                                <th className="p-3 text-left border">
                                    Reported At
                                </th>
                                <th className="p-3 text-left border">
                                    Reported By
                                </th>
                                <th className="p-3 text-left border">Reason</th>
                                <th className="p-3 text-left border">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="border-b animate-pulse">
                                    <td className="p-3 border">
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    </td>
                                    <td className="p-3 border">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </td>
                                    <td className="p-3 border">
                                        <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                                    </td>
                                    <td className="p-3 border">
                                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                                    </td>
                                    <td className="p-3 border">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </td>
                                    <td className="p-3 border">
                                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                                    </td>
                                    <td className="p-3 border">
                                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error loading listings</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            )}

            {!loading && !error && listings.length === 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-500 text-center py-8">
                        No reported listings to display.
                    </p>
                </div>
            )}

            {!loading && !error && listings.length > 0 && (
                <ListingsTable listings={listings} />
            )}
        </div>
    );
}
