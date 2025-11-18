import React from "react";

interface LoadingProps {
    message?: string;
    size?: "sm" | "md" | "lg";
}

export default function Loading({
    message = "Loading...",
    size = "md",
}: LoadingProps) {
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-12 w-12",
        lg: "h-16 w-16",
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div
                className={`animate-spin rounded-full border-b-2 border-blue-500 mb-4 ${sizeClasses[size]}`}
            ></div>
            <p className="text-gray-600 text-lg">{message}</p>
        </div>
    );
}
