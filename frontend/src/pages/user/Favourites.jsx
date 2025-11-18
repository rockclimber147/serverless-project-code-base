import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../../components/ItemCard";
import { ListingAPIService } from "@/services/listingsApi";

export default function Favourites() {
  const navigate = useNavigate();
  
  const [listings, setListings] = useState([]);
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    async function fetchInitialListings() {
      try {
        const data = await ListingAPIService.getFavoriteListings(userId);
        setListings(data);
      } catch (err) {
        console.error("Failed to load listings:", err);
      }
    }
  fetchInitialListings();
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("idToken");

    if (!storedId || !storedToken) {
      navigate("/");
      return;
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen w-full container mx-auto pt-4">
      <div>
        <div className="flex justify-between items-center mb-8 pt-16 pl-4">
          <h2 className="text-3xl font-semibold">Favourites</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
