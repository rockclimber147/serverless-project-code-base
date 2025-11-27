import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/api/endpoints";

interface User {
    id: string;
    role: string;
    givenName: string;
    familyName: string;
    email: string;
    prefLocation: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API_ENDPOINTS.viewUsers);
        if (!res.ok) throw new Error("Failed to load users");

        const data = await res.json();
        const usersArray: User[] = Array.isArray(data.body)
          ? data.body
          : JSON.parse(data.body ?? "[]");

        setUsers(usersArray);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { users, loading, error };
}
