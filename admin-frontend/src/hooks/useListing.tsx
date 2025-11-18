import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/api/endpoints";

interface Listing {
    listing_id: string;
    user_id: string;
    item_name: string;
    created_at: number;
    is_sold: boolean;
    is_removed: boolean;
    reports: Report[];
}

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API_ENDPOINTS.viewAllListings);
        if (!res.ok) throw new Error("Failed to load listings");

        const data = await res.json();
        setListings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { listings, loading, error };
}
