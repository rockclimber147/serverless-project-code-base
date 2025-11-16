import { create } from "zustand";

// API Configuration
const API_BASE = "https://y35kgh2yf3.execute-api.us-west-2.amazonaws.com/dev";

// Helper function to decode JWT
function parseJwt(token: string) {
    try {
        return JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
    } catch (e) {
        return null;
    }
}

// API helper function
async function post(path: string, body: any, authToken?: string) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: any;
    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }

    // Unwrap Lambda proxy response if it exists
    if (data && data.body) {
        try {
            return JSON.parse(data.body);
        } catch {
            return data.body;
        }
    }

    return data;
}

interface AuthState {
    idToken: string | null;
    userId: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    idToken: null,
    userId: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    initializeAuth: () => {
        const storedToken = localStorage.getItem("idToken");
        const storedUserId = localStorage.getItem("userId");

        if (storedToken && storedUserId) {
            set({
                idToken: storedToken,
                userId: storedUserId,
                isAuthenticated: true,
            });
        }
    },

    login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
            const res = await post("/signin", { username, password });

            if (res.idToken) {
                const claims = parseJwt(res.idToken);
                const userId = claims?.sub || null;

                localStorage.setItem("idToken", res.idToken);
                if (userId) {
                    localStorage.setItem("userId", userId);
                }

                set({
                    idToken: res.idToken,
                    userId,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            } else if (res.error) {
                set({
                    isLoading: false,
                    error: res.error,
                    isAuthenticated: false,
                });
            } else {
                set({
                    isLoading: false,
                    error: "Sign-in failed. Please try again.",
                    isAuthenticated: false,
                });
            }
        } catch (err) {
            set({
                isLoading: false,
                error: "Sign-in failed. Please try again.",
                isAuthenticated: false,
            });
        }
    },

    logout: () => {
        localStorage.removeItem("idToken");
        localStorage.removeItem("userId");
        set({
            idToken: null,
            userId: null,
            isAuthenticated: false,
            error: null,
        });
    },
}));
