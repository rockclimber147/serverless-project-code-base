import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_ENDPOINTS } from "../api/endpoints";
import { formatDate } from "../utils/dateUtils";
import Button from "../components/Button";
import DeleteModal from "../components/DeleteModal";

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
  is_removed: boolean;
}

export default function ViewListing() {
  const { listingId } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deleteButtonColor = listing?.is_removed ? "green" : "red";
  const deleteButtonText = listing?.is_removed ? "Reactivate Listing" : "Delete Listing";
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          API_ENDPOINTS.viewListing+`${listingId}`
        );

        if (!res.ok) throw new Error("Failed to load reports");

        const data = await res.json();
        setListing(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [listingId]);

  if (loading) return <p>Loading listing details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!listing) return <p>No listing found.</p>;

  async function handleDelete() {
    if (!listing) return;
    try {
      const res = await fetch(API_ENDPOINTS.deleteListing, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listing.listing_id,
          reason: deleteReason,
        })
      });

      const data = await res.json();
      console.log("Delete response:", data);

      setDeleteModalOpen(false);
      setListing(prev =>
        prev ? { ...prev, is_removed: !prev.is_removed } : prev
      );

    } catch (err) {
      console.error("Error deleting:", err);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/reported-listings" className="text-blue-600 underline">
        ← Back to Reported Listings
      </Link>

      <h1 className="text-3xl font-bold mt-4">Listing Details</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <p><strong>Item:</strong> {listing.item_name}</p>
        <p><strong>Seller User ID:</strong> {listing.user_id}</p>
        <p><strong>Total Reports:</strong> {listing.reports.length}</p>
        <Button color="neutral" to="">View Listing</Button>
        <Button color={deleteButtonColor} onClick={() => setDeleteModalOpen(true)} className="mx-1">
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
              <td className="p-3 border">{formatDate(r.reported_at)}</td>
              <td className="p-3 border">{r.reason}</td>
              <td className="p-3 border">{r.reported_by}</td>
            </tr>
          ))}
        </tbody>
      </table>

    {!listing.is_removed ? (
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Enter the reason for deleting (*)"
      >
        <textarea
          className="w-full border rounded-lg p-2 h-28 resize-none focus:ring-primary focus:border-primary"
          placeholder="Type your reason..."
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
        />

        <div className="flex justify-end mt-4 gap-2">
          <Button
            color="neutral"
            variant="outline"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </Button>

          <Button color="red" onClick={handleDelete}>
            Delete Listing
          </Button>
        </div>
      </DeleteModal>
    ) : (
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Reactivate Listing"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to reactivate this listing?
        </p>

        <div className="flex justify-end mt-4 gap-2">
          <Button
            color="neutral"
            variant="outline"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </Button>

          <Button color="green" onClick={handleDelete}>
            Reactivate Listing
          </Button>
        </div>
      </DeleteModal>
    )}
    </div>
  );
}
