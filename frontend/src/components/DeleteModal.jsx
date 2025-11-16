import React from "react";
import Modal from "@mui/material/Modal";
import { ListingCRUDAPIService } from "@/services/listingsUser";
import PropTypes from "prop-types";

export default function DeleteModal(props) {
  const { listingId, open, setOpen } = props;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    try {
      await ListingCRUDAPIService.deleteListing(listingId);
    } catch (err) {
      console.error("Failed to delete listing:", err);
    }
  };
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form
        onSubmit={handleSubmit}
        className=" flex items-center flex-col rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-gray-200 shadow-2xl p-4"
      >
        <h3 className="flex flex-col items-center mb-2">
          Are you sure you want to delete this listing?
        </h3>

        <div>
          <button
            type="submit"
            className="rounded-lg bg-red-400 text-white px-2 py-1 hover:bg-red-500 mr-2"
          >
            {" "}
            Yes
          </button>
          <button
            className="rounded-lg bg-white border border-neutral-400 px-2 py-1"
            onClick={() => setOpen(false)}
          >
            {" "}
            No
          </button>
        </div>
      </form>
    </Modal>
  );
}

DeleteModal.propTypes = {
  listingId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
