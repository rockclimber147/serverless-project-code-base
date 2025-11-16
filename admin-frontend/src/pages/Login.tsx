import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const { login, isAuthenticated, isLoading, error, initializeAuth } =
        useAuthStore();

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    // Redirect to dashboard if already authenticated
    if (isAuthenticated && !isLoading) {
        // TODO: Add admin check here before navigating
        return <Navigate to="/dashboard" replace />;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setValidationError("");

        if (!username || !password) {
            setValidationError("Please enter both username and password.");
            return;
        }

        await login(username, password);
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold mb-4">Admin Sign In</h1>

                {(error || validationError) && (
                    <div className="text-red-600 bg-red-100 p-2 rounded">
                        {error || validationError}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </button>
            </form>
        </div>
    );
}
