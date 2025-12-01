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
        className="detail-page absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md"
      >
        <div className="auth-card p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Report Listing</h3>
              <p className="text-sm text-gray-500">Help us keep the marketplace safe</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-700 font-medium text-center">Report submitted successfully!</p>
              <p className="text-sm text-gray-500 mt-1">Thank you for helping us maintain a safe community.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="report-reason" className="block text-sm font-medium text-gray-700 mb-2">
                  What&apos;s wrong with this listing?
                </label>
                <textarea
                  id="report-reason"
                  rows={4}
                  className="auth-input resize-none"
                  placeholder="Please describe the issue (e.g., misleading description, inappropriate content, suspected scam...)"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="auth-error mb-4 flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className="detail-btn-secondary flex-1"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            {!success && (
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none flex items-center justify-center gap-2"
                disabled={isSubmitting || success}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            )}
          </div>
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
