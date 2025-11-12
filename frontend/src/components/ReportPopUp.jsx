import React from "react";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";

export default function ReportPopUp(props) {
  const { open, setOpen } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
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
        className=" flex  items-center flex-col rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-gray-200 shadow-2xl p-4"
      >
        <h3 className="flex flex-col items-center mb-2">Report listing?</h3>
        <textarea
          rows={4}
          className="rounded-md w-full p-2 mb-2"
          placeholder="Please provide an explanation."
        ></textarea>
        <div>
          <button
            type="submit"
            className="rounded-lg bg-red-400 text-white px-2 py-1 hover:bg-red-500 mr-2"
          >
            {" "}
            Report
          </button>
          <button
            className="rounded-lg bg-white border border-neutral-400 px-2 py-1"
            onClick={() => setOpen(false)}
          >
            {" "}
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

ReportPopUp.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
