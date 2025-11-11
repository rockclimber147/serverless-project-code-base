import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function ItemCard(props) {
  const { item } = props;
  const [favourite, setFavourite] = useState(false);

  const handleToggleFavourite = async () => {
    setFavourite(!favourite);
    // TODO: Add backend logic
  };

  return (
    <div className="w-64 m-2">
      <div className="relative">
        <img
          src={item.imageUrl}
          className="rounded-lg mb-2 object-cover w-full "
        />
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
        <h5 className="text-lg">{item.name}</h5>
        <b>${item.price}</b>
      </div>
      <p className="text-neutral-400 text-sm">{item.location}</p>
    </div>
  );
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    location: PropTypes.string,
  }).isRequired,
};
