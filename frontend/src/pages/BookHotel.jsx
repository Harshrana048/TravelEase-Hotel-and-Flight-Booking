import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getHotelById } from "../redux/slices/hotelSlice";
import {
  bookHotel,
  createPaymentOrder,
  verifyPayment,
} from "../redux/slices/bookingSlice";
import ReviewBookingModal from "../components/hotel/HotelReviewModal";

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/* ---------- presentational helpers (UI only) ---------- */

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.9 3.9 6.7-6.7a1 1 0 011.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ShieldIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 1.5l6.5 2.6v5.2c0 4.6-2.8 8.4-6.5 9.7-3.7-1.3-6.5-5.1-6.5-9.7V4.1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TagIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor">
      <path d="M3 3a1 1 0 011-1h6.2a1 1 0 01.7.3l6.8 6.8a1 1 0 010 1.4l-6.3 6.3a1 1 0 01-1.4 0L3.3 10.2a1 1 0 01-.3-.7zm4 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  );
}

function HeadsetIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor">
      <path d="M10 2a7 7 0 00-7 7v4a2 2 0 002 2h1v-6H4v-.5a6 6 0 0112 0V15h-2v6h1a2 2 0 002-2v-.6A2 2 0 0018 16v-3a2 2 0 00-1-1.7V9a7 7 0 00-7-7z" />
    </svg>
  );
}

export default function BookHotel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentHotel, loading: hotelLoading } = useSelector(
    (state) => state.hotels,
  );
  const {
    currentBooking,
    loading: bookingLoading,
    paymentOrder,
  } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    roomsBooked: 1,
    guests: [{ name: "", age: "" }],
    contactPhone: user?.phone || "",
  });

  // UI-only additions — do not affect the booking payload sent to the backend
  const [showReview, setShowReview] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");
  const SPECIAL_REQUESTS_LIMIT = 300;

  const nights = calculateNights(formData.checkInDate, formData.checkOutDate);
  const totalPrice = currentHotel
    ? nights * currentHotel.pricePerNight * formData.roomsBooked
    : 0;

  // Min date is today
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    dispatch(getHotelById(id));
  }, [id, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuestChange = (index, field, value) => {
    const newGuests = [...formData.guests];
    newGuests[index][field] = value;
    setFormData({ ...formData, guests: newGuests });
  };

  const addGuest = () => {
    if (formData.guests.length < formData.roomsBooked * 2) {
      setFormData({
        ...formData,
        guests: [...formData.guests, { name: "", age: "" }],
      });
    } else {
      toast.error(`Maximum ${formData.roomsBooked * 2} guests allowed`);
    }
  };

  const removeGuest = (index) => {
    setFormData({
      ...formData,
      guests: formData.guests.filter((_, i) => i !== index),
    });
  };

  const handleGoToReview = () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (nights <= 0) {
      toast.error("Check-out date must be after check-in date");
      return;
    }
    if (formData.guests.some((g) => !g.name || !g.age)) {
      toast.error("Please fill all guest details");
      return;
    }
    if (!formData.contactPhone) {
      toast.error("Please enter contact phone");
      return;
    }
    setShowReview(true);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    // Validation
    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (nights <= 0) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (formData.guests.some((g) => !g.name || !g.age)) {
      toast.error("Please fill all guest details");
      return;
    }

    if (!formData.contactPhone) {
      toast.error("Please enter contact phone");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await dispatch(
        bookHotel({
          hotelId: id,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          roomsBooked: formData.roomsBooked,
          guests: formData.guests,
          contactPhone: formData.contactPhone,
        }),
      ).unwrap();

      toast.success("Hotel booked successfully! Proceeding to payment...");

      // Create payment order
      const paymentResult = await dispatch(
        createPaymentOrder({
          bookingId: result._id,
          bookingType: "HotelBooking",
        }),
      ).unwrap();

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: paymentResult.key,
          amount: paymentResult.amount * 100,
          currency: "INR",
          name: "TravelEase",
          description: `Hotel Booking - ${currentHotel.name}`,
          order_id: paymentResult.orderId,
          handler: async (response) => {
            try {
              

              const verifyResult = await dispatch(
                verifyPayment({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  bookingId: result._id,
                  bookingType: "HotelBooking",
                }),
              ).unwrap();

              

              toast.success("Payment verified! Redirecting...");

              setTimeout(() => {
                navigate("/payment-success", {
                  state: { bookingId: result._id, bookingType: "HotelBooking" },
                });
                setIsProcessing(false);
              }, 1000);
            } catch (err) {
              console.error("❌ Error:", err);
              const errorMsg =
                typeof err === "string"
                  ? err
                  : err?.message || "Payment verification failed";

              toast.error(errorMsg);

              setTimeout(() => {
                navigate("/payment-failure", {
                  state: { error: errorMsg },
                });
                setIsProcessing(false);
              }, 1000);
            }
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          },
          prefill: {
            email: user?.email,
            contact: formData.contactPhone,
          },
          theme: {
            color: "#1d4ed8",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response){
            setIsProcessing(false);
        });
        razorpay.open();
      };
    } catch (err) {
      // ✅ CORRECT
      const errorMsg =
        typeof err === "string" ? err : err?.message || "Failed to book hotel";
      toast.error(errorMsg);
      setIsProcessing(false);
    }
  };

  if (hotelLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-primary"></div>
      </div>
    );
  }

  if (!currentHotel) {
    return (
      <div className="container py-24 text-center">
        <p className="text-xl text-gray-500 mb-3">Hotel not found</p>
        <Link to="/hotels" className="text-primary font-semibold hover:underline underline-offset-4">
          Back to Hotels
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-6 md:py-10">
        <Link
          to={`/hotels/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-gray-600">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.7 15.7a1 1 0 01-1.4 0l-5-5a1 1 0 010-1.4l5-5a1 1 0 111.4 1.4L8.42 10l4.3 4.3a1 1 0 010 1.4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          Back to Hotel
        </Link>
      <div className="px-4 sm:px-8 lg:px-20">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Complete Your Booking
        </h1>
        <p className="mt-2 text-gray-500">
          Please enter your details to complete your hotel reservation.
        </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 px-4 sm:px-8 lg:px-20">
          {/* ---------- Left column ---------- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Details */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Guest Details
              </h2>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    min={today}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    min={formData.checkInDate || today}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    required
                  />
                </div>
              </div>

              {/* Rooms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms
                </label>
                <select
                  name="roomsBooked"
                  value={formData.roomsBooked}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                >
                  {Array.from(
                    { length: currentHotel.roomsAvailable },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ),
                  )}
                </select>
                <p className="text-gray-400 text-xs mt-1.5">
                  {currentHotel.roomsAvailable} rooms available
                </p>
              </div>

              {/* Contact */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+91-9876543210"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  required
                />
              </div>
            </div>

            {/* Guests */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Guest Information
              </h2>
              <div className="space-y-4 mb-4">
                {formData.guests.map((guest, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Guest {index + 1} Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={guest.name}
                        onChange={(e) =>
                          handleGuestChange(index, "name", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="Age"
                        value={guest.age}
                        onChange={(e) =>
                          handleGuestChange(index, "age", e.target.value)
                        }
                        min="1"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      {formData.guests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGuest(index)}
                          className="w-full bg-danger/10 text-danger py-2 rounded-lg font-medium hover:bg-danger hover:text-white transition-colors text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {formData.guests.length < formData.roomsBooked * 2 && (
                <button
                  type="button"
                  onClick={addGuest}
                  className="text-primary font-semibold text-sm hover:underline underline-offset-4"
                >
                  + Add Guest
                </button>
              )}
            </div>

            {/* Special Requests */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Additional Information
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Special Requests (Optional)
              </p>
              <textarea
                value={specialRequests}
                onChange={(e) =>
                  e.target.value.length <= SPECIAL_REQUESTS_LIMIT &&
                  setSpecialRequests(e.target.value)
                }
                rows={4}
                placeholder="Any special requests or preferences?"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
              />
              <p className="text-right text-xs text-gray-400 mt-1.5">
                {specialRequests.length}/{SPECIAL_REQUESTS_LIMIT}
              </p>
            </div>

            {/* Info box */}
            <div className="flex items-start gap-3 rounded-2xl bg-primary/5 border border-primary/10 p-5">
              <span className="mt-0.5 shrink-0 text-primary">
                <ShieldIcon className="h-5 w-5" />
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">
                Please ensure all guest details exactly match your
                government-issued ID. These details will be used for booking
                confirmation.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                  <TagIcon className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  Best Price Guarantee
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Find it cheaper? We'll match it.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                  <HeadsetIcon className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  24/7 Customer Support
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  We're here whenever you need us.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                  <ShieldIcon className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  Secure Payments
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Your details are protected end-to-end.
                </p>
              </div>
            </div>
          </div>

          {/* ---------- Sticky Summary ---------- */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                Booking Summary
              </h2>

              {/* Hotel Info */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                {currentHotel.images?.[0] && (
                  <img
                    src={currentHotel.images[0]}
                    alt={currentHotel.name}
                    className="w-full h-40 object-cover rounded-2xl mb-4"
                  />
                )}
                <h3 className="font-bold text-gray-900">{currentHotel.name}</h3>
                {currentHotel.city && (
                  <p className="text-gray-500 text-sm mt-0.5">
                    {currentHotel.city}
                  </p>
                )}
                {currentHotel.rating != null && (
                  <div className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-gray-700">
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-amber-400">
                      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.74 1-5.8-4.21-4.1 5.82-.85z" />
                    </svg>
                    {currentHotel.rating}/5
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Check-in</p>
                <p className="font-semibold text-gray-900 text-sm mt-0.5">
                  {formData.checkInDate
                    ? new Date(formData.checkInDate).toDateString()
                    : "Not selected"}
                </p>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-gray-400 text-xs">Check-out</p>
                <p className="font-semibold text-gray-900 text-sm mt-0.5">
                  {formData.checkOutDate
                    ? new Date(formData.checkOutDate).toDateString()
                    : "Not selected"}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="mb-4 pb-4 border-b border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    ₹{currentHotel.pricePerNight}/night
                  </span>
                  <span className="font-semibold text-gray-900">
                    × {nights || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rooms</span>
                  <span className="font-semibold text-gray-900">
                    × {formData.roomsBooked}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Guests</span>
                  <span className="font-semibold text-gray-900">
                    {formData.guests.length}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">
                    ₹{totalPrice}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1.5">
                  {nights} night{nights !== 1 ? "s" : ""} ×{" "}
                  {formData.roomsBooked} room
                  {formData.roomsBooked !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoToReview}
                className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.99] flex items-center justify-center gap-2"
              >
                Review Booking
              </button>
              <p className="text-gray-400 text-xs mt-3 text-center">
                You can review your booking before proceeding to payment.
              </p>

              {/* Badges */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-success shrink-0">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  Secure Booking
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-success shrink-0">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  Best Price Guarantee
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-success shrink-0">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  Instant Confirmation
                </div>
              </div>

              {/* Free cancellation info */}
              <div className="mt-5 rounded-2xl bg-primary/5 p-4 text-xs text-gray-600 space-y-1.5">
                <p>✓ Free cancellation until 24 hours before check-in</p>
                <p>✓ Confirmation email will be sent after booking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Booking modal — separate component, all display data passed as props */}
      <ReviewBookingModal
        open={showReview}
        onClose={() => setShowReview(false)}
        onConfirm={handleSubmit}
        hotel={currentHotel}
        formData={formData}
        nights={nights}
        totalPrice={totalPrice}
        specialRequests={specialRequests}
        agreedToTerms={agreedToTerms}
        onAgreedToTermsChange={setAgreedToTerms}
        submitting={bookingLoading || isProcessing}
      />
    </div>
  );
}