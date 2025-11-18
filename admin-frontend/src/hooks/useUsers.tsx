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

interface UserBody {
    statusCode: number;
    body: User[];

}

export function useUsers() {
  const [users, setUsers] = useState<UserBody | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API_ENDPOINTS.viewUsers);
        if (!res.ok) throw new Error("Failed to load users");

        const data = await res.json();
        setUsers(data);
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
