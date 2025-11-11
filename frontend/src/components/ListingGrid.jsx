import React from "react";
import { Link } from "react-router-dom";

export default function ListingGrid({ listings }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {listings.map((item) => (
                <Link
                    key={item.id}
                    to={`/item-detail/${item.id}`}
                    className="border rounded p-3 w-52 hover:shadow-lg hover:scale-105 transition-transform duration-200"
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://pngimg.com/uploads/box/box_PNG49.png";
                        }}
                        className="w-full h-40 object-cover rounded"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <h3 className="font-semibold text-sm truncate max-w-[140px]">
                            {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.price}</p>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 truncate max-w-full">
                        {item.description}
                    </p>
                </Link>
            ))}
        </div>
    );
}
