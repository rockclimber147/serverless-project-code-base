import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuthStore } from "@/stores/authStore";

export default function Navbar() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar-themed flex items-center justify-between px-6 py-3 fixed top-0 left-0 w-full z-50">
            <div className="text-xl font-bold tracking-tight">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <span className="text-green-300">Admin</span>
                    <span className="text-white">CrockList</span>
                </Link>
            </div>

            <div className="flex items-center">
                <button
                    onClick={handleLogout}
                    className="nav-btn-logout flex items-center gap-2"
                >
                    <FaSignOutAlt className="text-lg" />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}
