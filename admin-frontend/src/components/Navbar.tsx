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
        <nav className="flex items-center justify-between bg-gray-800 p-2 text-white fixed top-0 left-0 w-full z-50">
            <div className="text-xl font-bold">
                <Link to="/dashboard">Admin CrockList</Link>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 hover:text-gray-300 transition"
                >
                    <FaSignOutAlt className="text-lg" />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}
