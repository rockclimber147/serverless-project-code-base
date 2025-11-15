import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../api/endpoints";

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
        output[key] = value.L
          .map((x: any) => x.M && parseDynamo(x.M))
          .filter(Boolean);
      else if (value?.M !== undefined) output[key] = parseDynamo(value.M);
      else output[key] = value;
    }

    return output as Listing;
  }

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(
          API_ENDPOINTS.reportedListings
        );

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
      <h1 className="text-3xl font-bold mb-6">Reported Listing Activity</h1>

      {loading && <p>Loading reported listings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500">No reported listings to display.</p>
        </div>
      )}

      {!loading && listings.length > 0 && (
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
              {listings.map((listing: Listing) => {
                const reports = listing.reports ?? [];
                const lastReport = reports[reports.length - 1];

                return (
                  <tr key={listing.listing_id} className="border-b">
                    <td className="p-3 border">{listing.item_name}</td>
                    <td className="p-3 border">{listing.user_id}</td>
                    <td className="p-3 border">{reports.length}</td>
                    <td className="p-3 border">{lastReport?.reported_at ?? "—"}</td>
                    <td className="p-3 border">{lastReport?.reported_by ?? "—"}</td>
                    <td className="p-3 border">{lastReport?.reason ?? "—"}</td>
                    <td className="p-3 border">View</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
