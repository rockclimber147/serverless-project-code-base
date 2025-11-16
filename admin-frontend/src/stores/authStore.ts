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

// Unified API helper function
async function request(
    method: "GET" | "POST",
    path: string,
    options: {
        body?: any;
        queryParams?: Record<string, string>;
        authToken?: string;
    } = {}
) {
    const { body, queryParams = {}, authToken } = options;

    // Build URL with query parameters
    const queryString = new URLSearchParams(queryParams).toString();
    const url = queryString
        ? `${API_BASE}${path}?${queryString}`
        : `${API_BASE}${path}`;

    // Set up headers
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Build fetch options
    const fetchOptions: RequestInit = {
        method,
        headers,
    };
    if (body && method === "POST") {
        fetchOptions.body = JSON.stringify(body);
    }

    // Make the request
    const res = await fetch(url, fetchOptions);
    const text = await res.text();

    // Parse response
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

// Convenience functions for better readability
async function post(path: string, body: any, authToken?: string) {
    return request("POST", path, { body, authToken });
}

async function get(
    path: string,
    queryParams: Record<string, string> = {},
    authToken?: string
) {
    return request("GET", path, { queryParams, authToken });
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
            // Step 1: Sign in to get the token
            const res = await post("/signin", { username, password });

            if (res.idToken) {
                const claims = parseJwt(res.idToken);
                const userId = claims?.sub || null;

                if (!userId) {
                    set({
                        isLoading: false,
                        error: "Sign-in failed. Please try again.",
                        isAuthenticated: false,
                    });
                    return;
                }

                // Step 2: Fetch user info to check role
                try {
                    const userInfo = await get(
                        "/fetchuser",
                        { id: userId },
                        res.idToken
                    );

                    // Check if user has admin role
                    if (userInfo?.data?.role !== "admin") {
                        // Clear any tokens that might have been set
                        localStorage.removeItem("idToken");
                        localStorage.removeItem("userId");
                        set({
                            idToken: null,
                            userId: null,
                            isLoading: false,
                            error: "Access denied. Admin privileges required.",
                            isAuthenticated: false,
                        });
                        return;
                    }

                    // User is admin, proceed with login
                    localStorage.setItem("idToken", res.idToken);
                    localStorage.setItem("userId", userId);

                    set({
                        idToken: res.idToken,
                        userId,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (fetchError) {
                    // Failed to fetch user info, clear tokens and show error
                    localStorage.removeItem("idToken");
                    localStorage.removeItem("userId");
                    set({
                        idToken: null,
                        userId: null,
                        isLoading: false,
                        error: "Failed to verify user role. Please try again.",
                        isAuthenticated: false,
                    });
                }
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
