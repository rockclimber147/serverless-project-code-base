import React, { useEffect } from "react";
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
      item_name: "Item1",
      price: 123,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
      location: "123 Main Street, BC",
      image: "https://picsum.photos/seed/item1/300/200",
    },
    {
      id: 2,
      item_name: "Item2",
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
      price: 234,
      location: "234 Oak Avenue, BC",
      image: "https://picsum.photos/seed/item2/300/200",
    },
    {
      id: 3,
      item_name: "Item3",
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
      price: 345,
      location: "345 Pine Road, BC",
      image: "https://picsum.photos/seed/item3/300/200",
    },
    {
      id: 4,
      item_name: "Item4",
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
      price: 456,
      location: "456 Maple Street, BC",
      image: "https://picsum.photos/seed/item4/300/200",
    },
    {
      id: 5,
      item_name: "Item5",
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
      price: 567,
      location: "567 Cedar Drive, BC",
      image: "https://picsum.photos/seed/item5/300/200",
    },
    {
      id: 6,
      item_name: "Item6",
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
      price: 678,
      location: "678 Spruce Lane, BC",
      image: "https://picsum.photos/seed/item6/300/200",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full container mx-auto pt-4">
      <div>
        <div className="flex justify-between items-center mb-8 pt-16 pl-4">
          <h2 className="text-3xl font-semibold">Favourites</h2>
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
