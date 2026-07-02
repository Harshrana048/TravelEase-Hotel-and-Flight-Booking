import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { cancelAndRefundBooking } from "../../redux/slices/dashboardSlice";

function AlertIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8.3 3.1a2 2 0 013.4 0l6.4 11.1a2 2 0 01-1.7 3H3.6a2 2 0 01-1.7-3zM10 7a1 1 0 011 1v3a1 1 0 01-2 0V8a1 1 0 011-1zm0 7.25a1 1 0 100 2 1 1 0 000-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function CancelBookingModal({ booking, bookingType, onClose }) {
  const dispatch = useDispatch();
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    try {
      const paymentId = booking.paymentId;

      if (!paymentId) {
        toast.error("Payment ID not found. Cannot process refund.");
        return;
      }

      setCancelling(true);

      await dispatch(cancelAndRefundBooking(paymentId)).unwrap();

      toast.success(
        "Booking cancelled! Refund initiated. You will receive it in 3-5 business days.",
      );
      onClose();
    } catch (err) {
      toast.error(err || "Failed to cancel booking and refund");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-7">
          <div className="flex items-start gap-4 mb-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Cancel Booking?
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                This action can't be undone.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              Cancelling this booking will:
            </p>
            <ul className="text-sm text-amber-800 space-y-1.5 ml-4 list-disc">
              <li>Mark the booking as cancelled</li>
              <li>Process a full refund to your original payment method</li>
              <li>Refund will appear in 3-5 business days</li>
              <li>Rooms/seats will be made available again</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mb-6">
            <p className="text-gray-500 text-xs">Refund Amount</p>
            <p className="text-2xl font-bold text-success mt-1">
              ₹{booking.totalPrice}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={cancelling}
              className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Keep Booking
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 rounded-xl bg-danger py-3 font-bold text-white hover:bg-red-700 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:shadow-none"
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel & Refund"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}