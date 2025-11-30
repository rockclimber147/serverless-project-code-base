import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const { login, isAuthenticated, isLoading, error } = useAuthStore();

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
        <div className="auth-page flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        <span className="text-green-300">Admin</span> CrockList
                    </h2>
                    <p className="text-green-200/70">Administration Portal</p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="auth-card p-8 flex flex-col gap-5"
                >
                    <div className="text-center mb-2">
                        <h1 className="auth-title text-2xl">Admin Sign In</h1>
                        <p className="auth-subtitle mt-1">Enter your admin credentials</p>
                    </div>

                    {(error || validationError) && (
                        <div className="auth-error">
                            {error || validationError}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="auth-input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="auth-btn-primary mt-2"
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center mt-8 text-green-200/50 text-sm relative z-10">
                    Authorized personnel only
                </p>
            </div>
        </div>
    );
}
