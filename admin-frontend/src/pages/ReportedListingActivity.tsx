import React from "react";

export default function ReportedListingActivity() {
  return (
    <div className="flex flex-col min-h-screen w-full container mx-auto pt-4 px-4">
      <h1 className="text-3xl font-bold mb-6">Reported Listing Activity</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-gray-500">
          <p>No reported listings to display.</p>
          <p className="text-sm mt-2">
            Backend integration will be added later.
          </p>
        </div>
      </div>
    </div>
  );
}

