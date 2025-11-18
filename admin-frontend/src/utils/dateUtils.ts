/**
 * Formats a date number (YYYYMMDD format) into a readable string
 * @param dateNumber - Date in YYYYMMDD format (e.g., 20251112)
 * @returns Formatted date string (e.g., "Nov 12, 2025")
 */
export function formatDate(dateNumber: number | undefined | null): string {
    if (!dateNumber) {
        return "—";
    }

    // Convert number to string to parse
    const dateStr = dateNumber.toString();

    // Check if it's in YYYYMMDD format (8 digits)
    if (dateStr.length === 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);

        try {
            const date = new Date(
                parseInt(year),
                parseInt(month) - 1, // Month is 0-indexed
                parseInt(day)
            );

            // Format as "Month Day, Year" (e.g., "Nov 12, 2025")
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            // If parsing fails, return the original number
            return dateStr;
        }
    }

    // If it's not in expected format, try to parse as timestamp
    // Check if it's a Unix timestamp (10 or 13 digits)
    if (dateStr.length === 10 || dateStr.length === 13) {
        try {
            const timestamp = dateStr.length === 10 
                ? parseInt(dateStr) * 1000 
                : parseInt(dateStr);
            const date = new Date(timestamp);
            
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            return dateStr;
        }
    }

    // Fallback: return as-is if format is unrecognized
    return dateStr;
}

/**
 * Formats a date with time included
 * @param dateNumber - Date in YYYYMMDD format or timestamp
 * @returns Formatted date and time string (e.g., "Nov 12, 2025, 3:45 PM")
 */
export function formatDateTime(dateNumber: number | undefined | null): string {
    if (!dateNumber) {
        return "—";
    }

    const dateStr = dateNumber.toString();

    if (dateStr.length === 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);

        try {
            const date = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
            );

            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            });
        } catch (error) {
            return dateStr;
        }
    }

    if (dateStr.length === 10 || dateStr.length === 13) {
        try {
            const timestamp = dateStr.length === 10 
                ? parseInt(dateStr) * 1000 
                : parseInt(dateStr);
            const date = new Date(timestamp);
            
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            });
        } catch (error) {
            return dateStr;
        }
    }

    return dateStr;
}

/**
 * Parses a timestamp into a Date object.
 * @param value - Timestamp as number (seconds or milliseconds)
 * @returns Parsed Date object or null if parsing fails
 */
export function parseTimestamp(value: number | string | undefined | null): Date | null {
    if (value == null) return null;

    const n = Number(value);
    if (!Number.isFinite(n) || Number.isNaN(n)) return null;

    // Heuristic: < 1e12 => seconds, else milliseconds
    const ms = n < 1e12 ? n * 1000 : n;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
}

