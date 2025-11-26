import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/api/endpoints";

interface Report {
    reason: string;
    reported_at: number;
    reported_by: string;
}

export interface Listing {
    listing_id: string;
    user_id: string;
    item_name: string;
    reports: Report[];
    is_removed: boolean;
}

export function useOneListing(listingId: string | undefined) {
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!listingId) return;

        async function load() {
            try {
                const res = await fetch(API_ENDPOINTS.viewListing + listingId);
                if (!res.ok) throw new Error("Failed to load listing");

                const data = await res.json();

                setListing(data.data ?? data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [listingId]);

    return { listing, loading, error, setListing };
}
