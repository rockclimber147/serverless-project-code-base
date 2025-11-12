import React from "react";
import { useState } from "react";
import SellerCard from "@/components/SellerCard";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";

export default function ItemDetails() {
  const location = useLocation();

  const { item } = location.state || {};
  const [modalOpen, setModalOpen] = useState(false);
  // TODO: replace
  const user = {
    name: "Name",
  };

  const [favourite, setFavourite] = useState(false);

  return (
    <div className="flex w-full gap-4 h-screen">
      <div className="flex-[3] flex justify-center items-center">
        <img
          src={item?.imageUrl}
          className="object-cover h-full object-cover w-full"
        />
      </div>

      {/* Item details */}
      <div className="m-4 flex-[1]">
        {/* Item main info */}
        <div className="mb-2">
          <div className="flex justify-between">
            <h2 className="text-4xl">{item?.name}</h2>
            <button onClick={() => setFavourite(!favourite)}>
              {favourite ? (
                <FaHeart className="text-red-500 text-xl transition-colors duration-200" />
              ) : (
                <FaRegHeart className="hover:text-red-500 text-xl transition-colors duration-200" />
              )}
            </button>
          </div>
          <p className="text-2xl">${item?.price}</p>
          <p className="text-md">{item?.location}</p>
        </div>

        <div className="flex w-full gap-2 mb-4">
          <button className="bg-blue-500 rounded-lg px-2 py-1 text-white flex-1 ">
            <Link to="/chat">Message</Link>
          </button>
          <button
            className="bg-red-500 rounded-lg px-2 py-1 text-white w-16"
            onClick={() => setModalOpen(true)}
          >
            Report
          </button>
        </div>

        {/* Description */}
        <div className="flex flex-col  justify-between">
          <div>
            <h3 className="text-2xl"> Details</h3>

            <p>{item?.description}</p>
          </div>

          <div>
            <hr className="border-gray-400 my-4" />
            <SellerCard user={user} />
          </div>
        </div>
      </div>

      {modalOpen && <ReportPopUp open={modalOpen} setOpen={setModalOpen} />}
    </div>
  );
}

function ReportPopUp(props) {
  const { open, setOpen } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    setOpen(false);
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form
          onSubmit={handleSubmit}
          className=" flex  items-center flex-col rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-gray-200 shadow-2xl p-4"
        >
          <h3 className="flex flex-col items-center mb-2">Report listing?</h3>
          <textarea
            rows={4}
            className="rounded-md w-full p-2 mb-2"
            placeholder="Please provide an explanation."
          ></textarea>
          <button
            type="submit"
            className="rounded-lg bg-red-400 text-white px-2 py-1 hover:bg-red-500"
          >
            {" "}
            Report
          </button>
        </form>
      </Modal>
    </div>
  );
}

ReportPopUp.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
