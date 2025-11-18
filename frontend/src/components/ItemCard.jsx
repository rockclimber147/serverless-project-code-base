import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ItemCard(props) {
  const { item } = props;
  const [favourite, setFavourite] = useState(false);
  const navigate = useNavigate();

  const handleToggleFavourite = async (e) => {
    e.stopPropagation();
    setFavourite(!favourite);
    // TODO: Add backend logic
  };

  return (
    <div
      className="w-full m-2"
      onClick={() => {
        navigate(`/item-details/${item.listing_id}`, { state: { item } });
      }}
    >
      <div className="relative">
        {item.image ? (
          <img
            src={item.image}
            className="rounded-lg mb-2 object-cover w-full h-48"
          />
        ) : (
          <div className="rounded-lg mb-2 object-cover w-full h-48 justify-center flex items-center bg-neutral-400">
            No image
          </div>
        )}

        <button
          className="absolute top-2 right-2 z-10"
          onClick={handleToggleFavourite}
        >
          {favourite ? (
            <FaHeart className="text-red-500 text-xl transition-colors duration-200" />
          ) : (
            <FaRegHeart className="text-white hover:text-red-500 text-xl transition-colors duration-200" />
          )}
        </button>
      </div>

      <div className="flex justify-between items-center mb-1 w-full">
        <h5 className="text-lg">{item.item_name}</h5>
        <b>${item.price}</b>
      </div>

      <p className="text-neutral-400 text-sm">
        {item?.location || "No location available"}
      </p>
    </div>
  );
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    listing_id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    item_name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    location: PropTypes.string,
  }).isRequired,
};
