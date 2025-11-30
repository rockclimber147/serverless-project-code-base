import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_ENDPOINTS } from "../api/endpoints";
import { formatDate } from "../utils/dateUtils";
import Button from "../components/Button";
import DeleteModal from "../components/DeleteModal";
import Loading from "../components/Loading";
import { useOneListing } from "@/hooks/useOneListing";

export default function ViewListing() {
    const { listingId } = useParams();
    const {
        listing,
        loading,
        error,
        setListing,
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

            const data = await res.json()

            setListing((prev) =>
                prev ? { ...prev, is_removed: !prev.is_removed } : prev
            );

            setDeleteModalOpen(false);
        } catch (err) {
            console.error("Error deleting:", err);
        }
    }

    if (loading) {
        return (
            <div className="detail-page pt-16">
                <div className="container mx-auto px-6 py-8">
                    <div className="detail-card p-8">
                        <Loading message="Loading listing details..." />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="detail-page pt-16">
                <div className="container mx-auto px-6 py-8">
                    <div className="detail-card p-6 border-l-4 border-l-red-500">
                        <p className="font-semibold text-red-700">Error loading listing</p>
                        <p className="text-sm mt-2 text-gray-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="detail-page pt-16">
                <div className="container mx-auto px-6 py-8">
                    <div className="detail-card p-8">
                        <p className="text-gray-500 text-center py-8">
                            No listing found.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="detail-page pt-16">
            <div className="container mx-auto px-6 py-8">
                {/* Back Link */}
                <Link to="/reported-listings" className="detail-link inline-flex items-center gap-2 mb-6">
                    <span>←</span> Back to Reported Listings
                </Link>

                {/* Page Title */}
                <h1 className="detail-title text-4xl mb-6">Listing Details</h1>

                {/* Listing Info Card */}
                <div className="detail-card p-8 mb-8">
                    <div className="grid gap-4 mb-6">
                        <div className="flex items-baseline gap-3">
                            <span className="detail-label">Item:</span>
                            <span className="detail-value text-lg">{listing.item_name}</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="detail-label">Seller User ID:</span>
                            <span className="detail-value font-mono text-sm bg-green-50 px-2 py-1 rounded">{listing.user_id}</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="detail-label">Total Reports:</span>
                            <span className="detail-value">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-semibold">
                                    {listing.reports.length}
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-green-100">
                        <button
                            className="detail-btn-secondary"
                            onClick={() => {
                                const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
                                window.open(`${frontendUrl}/item-details/${listing.listing_id}`, '_blank');
                            }}
                        >
                            View Listing
                        </button>

                        <button
                            className={listing?.is_removed ? "detail-btn-success" : "detail-btn-danger"}
                            onClick={() => setDeleteModalOpen(true)}
                        >
                            {deleteButtonText}
                        </button>
                    </div>
                </div>

                {/* Reports Section */}
                <h2 className="detail-subtitle text-2xl mb-4">Reports</h2>

                <table className="detail-table min-w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Reported At</th>
                            <th>Reason</th>
                            <th>Reported By</th>
                        </tr>
                    </thead>

                    <tbody>
                        {listing.reports.map((r, index) => (
                            <tr key={index}>
                                <td className="font-medium">{index + 1}</td>
                                <td>{formatDate(r.reported_at)}</td>
                                <td>{r.reason}</td>
                                <td className="font-mono text-sm">{r.reported_by}</td>
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
                            className="detail-textarea w-full h-28"
                            placeholder="Type your reason..."
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                        />
                    )}

                    <div className="flex justify-end mt-6 gap-3">
                        <button
                            className="detail-btn-secondary"
                            onClick={() => setDeleteModalOpen(false)}
                        >
                            Cancel
                        </button>

                        <button
                            className={listing?.is_removed ? "detail-btn-success" : "detail-btn-danger"}
                            onClick={handleDelete}
                        >
                            {listing.is_removed
                                ? "Reactivate Listing"
                                : "Delete Listing"}
                        </button>
                    </div>
                </DeleteModal>
            </div>
        </div>
    );
}
