import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../../components/ItemCard";

export default function Favourites() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("idToken");

    if (!storedId || !storedToken) {
      navigate("/");
      return;
    }
  }, [navigate]);

  // TODO: replace
  const listings = [
    {
      id: 1,
      name: "Item1",
      price: 123,
      location: "123 Main Street, BC",
      imageUrl: "https://picsum.photos/seed/item1/300/200",
    },
    {
      id: 2,
      name: "Item2",
      price: 234,
      location: "234 Oak Avenue, BC",
      imageUrl: "https://picsum.photos/seed/item2/300/200",
    },
    {
      id: 3,
      name: "Item3",
      price: 345,
      location: "345 Pine Road, BC",
      imageUrl: "https://picsum.photos/seed/item3/300/200",
    },
    {
      id: 4,
      name: "Item4",
      price: 456,
      location: "456 Maple Street, BC",
      imageUrl: "https://picsum.photos/seed/item4/300/200",
    },
    {
      id: 5,
      name: "Item5",
      price: 567,
      location: "567 Cedar Drive, BC",
      imageUrl: "https://picsum.photos/seed/item5/300/200",
    },
    {
      id: 6,
      name: "Item6",
      price: 678,
      location: "678 Spruce Lane, BC",
      imageUrl: "https://picsum.photos/seed/item6/300/200",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full container mx-auto pt-4">
      <div>
        <div className="flex justify-between items-center mb-8 pt-16 pl-4">
          <h2 className="text-3xl font-semibold">
            Favourites
          </h2>
        </div>

        {/* Grid Wrapper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
