import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { fetchApiPost } from "@/services/authApi";

export default function ReportPopUp(props) {
  const { open, setOpen, listingId } = props;
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportReason.trim()) {
      setError("Please provide a reason for reporting this listing.");
      return;
    }

    const userId = localStorage.getItem("userId");
    const idToken = localStorage.getItem("idToken");

    if (!userId || !idToken) {
      setError(
        "You must be logged in to report a listing. Please sign in and try again."
      );
      return;
    }

    // Validate token is not empty string
    if (idToken.trim() === "") {
      setError("Authentication token is invalid. Please sign in again.");
      return;
    }

    if (!listingId) {
      setError("Listing ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const body = {
        user_id: userId,
        listing_id: listingId,
        user_report_reason: reportReason.trim(),
      };

      const response = await fetchApiPost(
        "/user/report/listing",
        body,
        idToken
      );
      const data = await response.json();

      if (response.ok && data) {
        setSuccess(true);
        setReportReason("");
        // Close modal after 1.5 seconds
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 1500);
      } else {
        setError(data.message || "Failed to submit report. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      setError(
        err.message ||
          "An error occurred while submitting your report. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setReportReason("");
    setError(null);
    setSuccess(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form
        onSubmit={handleSubmit}
        className=" flex  items-center flex-col rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-gray-200 shadow-2xl p-4"
      >
        <h3 className="flex flex-col items-center mb-2">Report listing?</h3>
        {success ? (
          <div className="text-green-600 mb-2 text-center">
            Report submitted successfully!
          </div>
        ) : (
          <>
            <textarea
              rows={4}
              className="rounded-md w-full p-2 mb-2"
              placeholder="Please provide an explanation."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              disabled={isSubmitting}
            />
            {error && (
              <div className="text-red-600 text-sm mb-2 text-center w-full">
                {error}
              </div>
            )}
          </>
        )}
        <div>
          <button
            type="submit"
            className="rounded-lg bg-red-400 text-white px-2 py-1 hover:bg-red-500 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || success}
          >
            {isSubmitting ? "Submitting..." : "Report"}
          </button>
          <button
            type="button"
            className="rounded-lg bg-white border border-neutral-400 px-2 py-1"
            onClick={handleClose}
            disabled={isSubmitting}
          >
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
  listingId: PropTypes.string.isRequired,
};
