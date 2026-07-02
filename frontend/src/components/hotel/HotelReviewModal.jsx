import { useEffect } from "react";

function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4.3 4.3a1 1 0 011.4 0L10 8.6l4.3-4.3a1 1 0 111.4 1.4L11.4 10l4.3 4.3a1 1 0 01-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 01-1.4-1.4L8.6 10 4.3 5.7a1 1 0 010-1.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
export default function HotelReviewBookingModal({
  open,
  onClose,
  onConfirm,
  hotel,
  formData,
  nights,
  totalPrice,
  specialRequests,
  agreedToTerms,
  onAgreedToTermsChange,
  submitting,
}) {
  // Lock background scroll while the modal is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 backdrop-blur border-b border-gray-100 rounded-t-3xl px-6 md:px-8 py-5">
          <h2 className="text-xl font-bold text-gray-900">Review Booking</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 md:px-8 py-6 space-y-6">
          {/* Hotel Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Hotel Details
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              {hotel.images?.[0] && (
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-full sm:w-40 h-32 object-cover rounded-xl shrink-0"
                />
              )}
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900">{hotel.name}</h4>
                {hotel.city && (
                  <p className="text-gray-500 text-sm mt-0.5">{hotel.city}</p>
                )}
                {hotel.rating != null && (
                  <div className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-gray-700">
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-amber-400">
                      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.74 1-5.8-4.21-4.1 5.82-.85z" />
                    </svg>
                    {hotel.rating}/5
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div>
                    <p className="text-xs text-gray-400">Check-in</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {new Date(formData.checkInDate).toDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Check-out</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {new Date(formData.checkOutDate).toDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Nights</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {nights}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Guest Details
            </h3>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              {formData.guests.map((guest, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {guest.name}
                  </span>
                  <span className="text-sm text-gray-500">Age {guest.age}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-500">Contact Phone</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formData.contactPhone}
                </span>
              </div>
              {specialRequests && (
                <div className="px-4 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                  <p className="text-sm text-gray-700">{specialRequests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Booking Summary
            </h3>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Room Charges (₹{hotel.pricePerNight} × {nights} night
                  {nights !== 1 ? "s" : ""} × {formData.roomsBooked} room
                  {formData.roomsBooked !== 1 ? "s" : ""})
                </span>
                <span className="font-semibold text-gray-900">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <span className="text-base font-semibold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-primary">
                  ₹{totalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => onAgreedToTermsChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-gray-600">
              I agree to the Terms &amp; Conditions and Privacy Policy.
            </span>
          </label>
        </div>

        {/* Footer buttons */}
        <div className="sticky bottom-0 flex flex-col sm:flex-row gap-3 bg-white/95 backdrop-blur border-t border-gray-100 rounded-b-3xl px-6 md:px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="sm:w-36 py-3.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!agreedToTerms || submitting}
            className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {submitting ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}