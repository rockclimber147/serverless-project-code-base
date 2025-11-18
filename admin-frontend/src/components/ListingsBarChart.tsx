import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { parseTimestamp } from "@/utils/dateUtils";

interface Listing {
    listing_id: string;
    created_at: number;
}

interface ListingsBarChartProps {
    listings: Listing[];
    months?: number;
}

function formatMonthLabel(d: Date) {
    return new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(d);
}

export default function ListingsBarChart({ listings, months=3 }: ListingsBarChartProps) {
  const { labels, counts } = useMemo(() => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Build an array of month-start Date objects in chronological order (oldest -> newest)
    const monthStarts: Date[] = [];
    for (let i = months - 1; i >= 0; i--) {
      monthStarts.push(new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - i, 1));
    }

    const counts = new Array(monthStarts.length).fill(0);

    for (const listing of listings || []) {
      const d = parseTimestamp(listing.created_at);
      if (!d) continue;
      const mStartMs = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      const idx = monthStarts.findIndex((ms) => ms.getTime() === mStartMs);
      if (idx >= 0) counts[idx] += 1;
    }

    const labels = monthStarts.map(formatMonthLabel);
    return { labels, counts };
  }, [listings, months]);

  const data = {
    labels,
    datasets: [
      {
        label: "Listings created",
        data: counts,
        backgroundColor: "#60A5FA",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Total Listings (Past 3 Months)</h2>
      <Bar data={data} />
    </div>
  );
}