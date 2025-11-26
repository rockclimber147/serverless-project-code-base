import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_ENDPOINTS } from "../api/endpoints";
import { formatDate } from "../utils/dateUtils";
import Button from "../components/Button";
import DeleteModal from "../components/DeleteModal";
import Loading from "../components/Loading";
import { useOneListing } from "@/hooks/useOneListing"; // <-- import it

export default function ViewListing() {
    const { listingId } = useParams();
    const {
        listing,
        loading,
        error,
        setListing, // you need this for toggle delete/reactivate
    } = useOneListing(listingId);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");

    const deleteButtonColor = listing?.is_removed ? "green" : "red";
    const deleteButtonText = listing?.is_removed
        ? "Reactivate Listing"
        : "Delete Listing";

    async function handleDelete() {
        if (!listing) return;

        try {
            const res = await fetch(API_ENDPOINTS.deleteListing, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listing_id: listing.listing_id,
                    reason: deleteReason,
                }),
            });

            const data = await res.json();
            console.log("Delete response:", data);

            // Update local state
            setListing((prev) =>
                prev ? { ...prev, is_removed: !prev.is_removed } : prev
            );

            setDeleteModalOpen(false);
        } catch (err) {
            console.error("Error deleting:", err);
        }
    }

    // --- LOADING UI ---
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <Loading message="Loading listing details..." />
                </div>
            </div>
        );
    }

    // --- ERROR UI ---
    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error loading listing</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-500 text-center py-8">
                        No listing found.
                    </p>
                </div>
            </div>
        );
    }

    // --- NORMAL RENDER ---
    return (
        <div className="container mx-auto px-4 py-6">
            <Link to="/reported-listings" className="text-blue-600 underline">
                ← Back to Reported Listings
            </Link>

            <h1 className="text-3xl font-bold mt-4">Listing Details</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                <p>
                    <strong>Item:</strong> {listing.item_name}
                </p>
                <p>
                    <strong>Seller User ID:</strong> {listing.user_id}
                </p>
                <p>
                    <strong>Total Reports:</strong> {listing.reports.length}
                </p>

                <Button color="neutral">View Listing</Button>

                <Button
                    color={deleteButtonColor}
                    onClick={() => setDeleteModalOpen(true)}
                    className="mx-1"
                >
                    {deleteButtonText}
                </Button>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Reports</h2>

            <table className="min-w-full border-collapse bg-white shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3 text-left border">#</th>
                        <th className="p-3 text-left border">Reported At</th>
                        <th className="p-3 text-left border">Reason</th>
                        <th className="p-3 text-left border">Reported By</th>
                    </tr>
                </thead>

                <tbody>
                    {listing.reports.map((r, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-3 border">{index + 1}</td>
                            <td className="p-3 border">
                                {formatDate(r.reported_at)}
                            </td>
                            <td className="p-3 border">{r.reason}</td>
                            <td className="p-3 border">{r.reported_by}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete/Reactivate Modal */}
            <DeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title={
                    listing.is_removed
                        ? "Reactivate Listing"
                        : "Enter the reason for deleting (*)"
                }
            >
                {!listing.is_removed && (
                    <textarea
                        className="w-full border rounded-lg p-2 h-28 resize-none focus:ring-primary focus:border-primary"
                        placeholder="Type your reason..."
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                    />
                )}

                <div className="flex justify-end mt-4 gap-2">
                    <Button
                        color="neutral"
                        variant="outline"
                        onClick={() => setDeleteModalOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button color={deleteButtonColor} onClick={handleDelete}>
                        {listing.is_removed
                            ? "Reactivate Listing"
                            : "Delete Listing"}
                    </Button>
                </div>
            </DeleteModal>
        </div>
    );
}
