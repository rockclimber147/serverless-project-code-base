import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  to?: string;
  color?: "red" | "green" | "neutral" | "lightGrey";
  variant?: "solid" | "outline" | "subtle";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colors = {
  red: {
    solid: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
    subtle: "bg-red-600/10 text-red-600 hover:bg-red-600/20",
  },
  green: {
    solid: "bg-green-600 hover:bg-green-700 text-white",
    outline: "border border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
    subtle: "bg-green-600/10 text-green-600 hover:bg-green-600/20",
  },
  neutral: {
    solid: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "border border-gray-600 text-gray-700 hover:bg-gray-700 hover:text-white",
    subtle: "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20",
  },
  lightGrey: {
    solid: "bg-gray-400 hover:bg-gray-500 text-white",
    outline: "border border-gray-600 text-gray-700 hover:bg-gray-700 hover:text-white",
    subtle: "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20",
  }
};

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

export default function Button({
  children,
  to,
  color = "neutral",
  variant = "solid",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const classes = clsx(
    "inline-block rounded-lg font-medium shadow-md transition duration-200 ease-in-out transform hover:scale-[1.02] my-3",
    colors[color][variant],
    sizes[size],
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
