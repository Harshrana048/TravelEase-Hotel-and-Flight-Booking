import { useState, useEffect,useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getFlightById } from "../redux/slices/flightSlice";
import {
  bookFlight,
  createPaymentOrder,
  verifyPayment,
} from "../redux/slices/bookingSlice";
import { ReviewModal } from "../components/index";

/* ─── Formatters (unchanged) ─────────────────────────────────────── */
const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const calcDuration = (dep, arr) => {
  const diff = new Date(arr) - new Date(dep);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
};






/* ─── Airline initials avatar ────────────────────────────────────── */
function AirlineAvatar({ name = "" }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold shrink-0">
      {initials}
    </div>
  );
}



/* ─── Main Component ─────────────────────────────────────────────── */
export default function BookFlight() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentFlight, loading: flightLoading } = useSelector((state) => state.flights);
  const { loading: bookingLoading } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

 ;

  const [formData, setFormData] = useState({
    passengers: [{ name: "", phone: "", age: "" }],
    tripType: "one-way",
    returnFlightId: "",
  });
  const [returnFlight, setReturnFlight] = useState(null);

  /* ── New UI-only state ── */
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    dispatch(getFlightById(id));
  }, [id, dispatch]);

  /* ── All original handlers — UNCHANGED ── */
  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...formData.passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setFormData({ ...formData, passengers: newPassengers });
  };

  const addPassenger = () => {
    if (currentFlight && formData.passengers.length < currentFlight.availableSeats) {
      setFormData({ ...formData, passengers: [...formData.passengers, { name: "", phone: "", age: "" }] });
    } else {
      toast.error("Cannot add more passengers than available seats");
    }
  };

  const removePassenger = (index) => {
    setFormData({ ...formData, passengers: formData.passengers.filter((_, i) => i !== index) });
  };

  const handleReturnFlightSelect = (e) => {
    const selectedId = e.target.value;
    setFormData({ ...formData, returnFlightId: selectedId });
  };

  const calculateTotalPrice = () => {
    if (!currentFlight) return 0;
    let total = currentFlight.price * formData.passengers.length;
    if (formData.tripType === "round-trip" && returnFlight) {
      total += returnFlight.price * formData.passengers.length;
    }
    return total;
  };

  /* ── New: validate → open review modal ── */
  const handleReviewBooking = (e) => {
    e.preventDefault();
    if (formData.passengers.some((p) => !p.name || !p.phone || !p.age)) {
      toast.error("Please fill all passenger details");
      return;
    }
    if (formData.tripType === "round-trip" && !formData.returnFlightId) {
      toast.error("Please select a return flight");
      return;
    }
    setShowReview(true);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  /* ── Original handleSubmit logic, now called from review modal ── */
 const handleProceedToPayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

  try {
    // 1. Initiate a Pending Reference Booking (Locks the seat on the backend)
    const result = await dispatch(
      bookFlight({
        flightId: id,
        passengers: formData.passengers,
        tripType: formData.tripType,
        returnFlightId: formData.returnFlightId || undefined,
      }),
    ).unwrap();

    // Changed text to reflect it's holding the seat, not fully booked yet
    toast.success("Seat held! Proceeding to payment gateway...");

    // 2. Create the Razorpay Order via your server backend
    const paymentResult = await dispatch(
      createPaymentOrder({ bookingId: result._id, bookingType: "FlightBooking" }),
    ).unwrap();

    // 3. Inject and mount Razorpay Checkout Script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: paymentResult.key,
        amount: paymentResult.amount * 100, // Razorpay takes amounts in subunits (paise)
        currency: "INR",
        name: "TravelEase",
        description: `Flight Booking - ${currentFlight.flightNumber}`,
        order_id: paymentResult.orderId,
        handler: async (response) => {
          try {
            // 4. Verify Payment Signatures (This transforms the backend state from 'PENDING' to 'CONFIRMED')
            const verifyResult = await dispatch(
              verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                bookingId: result._id,
                bookingType: "FlightBooking", // FIX: Was mistakenly "HotelBooking"
              }),
            ).unwrap();
            
            toast.success("Payment verified! Flight booked successfully.");
            
            setTimeout(() => {
              navigate("/payment-success", { 
                state: { bookingId: result._id, bookingType: "FlightBooking" } // FIX: Was mistakenly "HotelBooking"
              });
              setIsProcessing(false);
            }, 1000);
          } catch (err) {
            const errorMsg = typeof err === "string" ? err : err?.message || "Payment verification failed";
            toast.error(errorMsg);
            setTimeout(() => { 
              navigate("/payment-failure", { state: { error: errorMsg } }); 
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
          contact: formData.passengers[0]?.phone || "" 
        },
        theme: { color: "#1d4ed8" }, // Clean corporate travel blue theme
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response){
          setIsProcessing(false);
      });
      razorpay.open();
    };
  } catch (err) {
    const errorMsg = typeof err === "string" ? err : err?.message || "Failed to initiate booking";
    toast.error(errorMsg);
    setIsProcessing(false); 
  }
};

  /* ── Loading / not found states ── */
  if (flightLoading) {
    return (
      <>
        
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600" />
        </div>
      </>
    );
  }

  if (!currentFlight) {
    return (
      <>
        
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <p className="text-xl text-gray-600 mb-3">Flight not found</p>
          <Link to="/flights" className="text-blue-600 font-bold hover:underline">← Back to Flights</Link>
        </div>
      </>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <>
     

      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* ── Page header ── */}
          <div className="mb-8 py-5">
            <Link
              to={`/flights/${id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition mb-4"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              Back to Flight
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* ════════════════════════════════════════
                LEFT — Form
            ════════════════════════════════════════ */}
            <div className="space-y-6 ">

              {/* Hero card */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                {/* Blue accent header */}
                <div className="bg-linear-to-r from-blue-600 to-blue-500 px-8 pt-8 pb-14 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    {/* grid decoration */}
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                  {/* Plane silhouette */}
                  <div className="absolute right-8 bottom-4 opacity-20 pt-15">
                    <svg className="w-32 h-32" viewBox="0 0 24 24" fill="white">
                      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white relative">Complete Your Booking</h1>
                  <p className="mt-1 text-blue-100 text-sm relative">Fill in your details to proceed with the booking</p>
                </div>

                <div className="px-8 py-8 -mt-6">
                  <form onSubmit={handleReviewBooking} className="space-y-8">

                    {/* Trip Type */}
                    <div className="rounded-2xl border border-slate-200 p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                          </svg>
                        </div>
                        <h2 className="text-base font-bold text-slate-900">Trip Type</h2>
                      </div>
                      <div className="flex gap-3">
                        {["one-way", "round-trip"].map((type) => (
                          <label
                            key={type}
                            className={`flex items-center gap-3 flex-1 cursor-pointer rounded-xl border-2 px-4 py-3 transition-all ${
                              formData.tripType === type
                                ? "border-blue-600 bg-blue-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className={`h-4 w-4 rounded-full border-2 shrink-0 transition-all ${
                              formData.tripType === type ? "border-blue-600 bg-blue-600" : "border-slate-300"
                            }`}>
                              {formData.tripType === type && (
                                <div className="h-full w-full rounded-full bg-white scale-[0.45] block" />
                              )}
                            </div>
                            <input
                              type="radio"
                              name="tripType"
                              value={type}
                              checked={formData.tripType === type}
                              onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                              className="sr-only"
                            />
                            <span className={`text-sm font-semibold capitalize ${formData.tripType === type ? "text-blue-700" : "text-slate-600"}`}>
                              {type === "one-way" ? "One Way" : "Round Trip"}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Return flight dropdown */}
                      {formData.tripType === "round-trip" && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                            Return Flight
                          </label>
                          <select
                            value={formData.returnFlightId}
                            onChange={handleReturnFlightSelect}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                            required
                          >
                            <option value="">Choose a return flight</option>
                            <option value="flight-2">Sample Return Flight</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Passenger Details */}
                    <div className="rounded-2xl border border-slate-200 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900">Passenger Details</h2>
                          <p className="text-xs text-slate-400">Enter details as per official ID</p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-4">
                        {formData.passengers.map((passenger, index) => (
                          <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            {/* Passenger header */}
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-bold text-blue-600">Passenger {index + 1}</span>
                              {formData.passengers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePassenger(index)}
                                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition"
                                >
                                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              )}
                            </div>

                            {/* Fields */}
                            <div className="grid sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Full Name</label>
                                <input
                                  type="text"
                                  placeholder="Enter full name"
                                  value={passenger.name}
                                  onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Phone Number</label>
                                <input
                                  type="tel"
                                  placeholder="Enter phone number"
                                  value={passenger.phone}
                                  onChange={(e) => handlePassengerChange(index, "phone", e.target.value)}
                                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Age</label>
                                <input
                                  type="number"
                                  placeholder="Enter age"
                                  value={passenger.age}
                                  onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                                  min="1"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add passenger */}
                      {currentFlight.availableSeats > formData.passengers.length && (
                        <button
                          type="button"
                          onClick={addPassenger}
                          className="mt-4 w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          Add Passenger
                        </button>
                      )}
                    </div>

                    {/* Info box */}
                    <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-5 py-4">
                      <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Please ensure all details match your government-issued ID. Incorrect details may result in booking cancellation.
                      </p>
                    </div>

                    {/* Submit → opens review */}
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      Review Booking
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>

              {/* ── Bottom feature cards ── */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                      </svg>
                    ),
                    title: "Best Price Guarantee",
                    desc: "We offer the lowest prices",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                      </svg>
                    ),
                    title: "24/7 Customer Support",
                    desc: "We are here to help anytime",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    ),
                    title: "Secure Payments",
                    desc: "Your payments are safe with us",
                  },
                ].map((card) => (
                  <div key={card.title} className="rounded-2xl bg-white border border-slate-200 p-5 flex items-start gap-3 shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{card.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ════════════════════════════════════════
                RIGHT — Sticky Booking Summary
            ════════════════════════════════════════ */}
            <aside className="sticky top-24 self-start space-y-4">
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Booking Summary</p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Airline row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AirlineAvatar name={currentFlight.airline} />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{currentFlight.airline}</p>
                        <p className="text-xs text-slate-500">{currentFlight.flightNumber}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {currentFlight.class}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{currentFlight.source}</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                          {currentFlight.source?.slice(0, 3).toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{formatTime(currentFlight.departureTime)}</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <p className="text-[10px] text-slate-400 font-medium">
                          {calcDuration(currentFlight.departureTime, currentFlight.arrivalTime)}
                        </p>
                        <div className="flex items-center w-full gap-1">
                          <div className="h-px flex-1 bg-slate-300" />
                          <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                          </svg>
                          <div className="h-px flex-1 bg-slate-300" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Non-stop</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{currentFlight.destination}</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                          {currentFlight.destination?.slice(0, 3).toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{formatTime(currentFlight.arrivalTime)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {formatDate(currentFlight.departureTime)}
                    </span>
                    <span>·</span>
                    <span>{formData.tripType === "round-trip" ? "Round Trip" : "One Way"}</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-slate-200" />

                  {/* Fare breakdown */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Fare</span>
                      <span className="font-semibold text-slate-800">
                        ₹{currentFlight.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Taxes & Fees</span>
                      <span className="font-semibold text-slate-800">₹0</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Convenience Fee</span>
                      <span className="font-semibold text-slate-800">₹0</span>
                    </div>

                    {formData.tripType === "round-trip" && (
                      <div className="flex justify-between text-slate-600">
                        <span>Return Flight</span>
                        <span className="font-semibold">₹{returnFlight ? (returnFlight.price * formData.passengers.length).toLocaleString("en-IN") : 0}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-400 mb-1">Total Amount</p>
                      <p className="text-3xl font-extrabold text-blue-600">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formData.passengers.length} passenger{formData.passengers.length !== 1 ? "s" : ""} · {formData.tripType === "round-trip" ? "Round Trip" : "One Way"}
                      </p>
                    </div>
                  </div>

                  {/* Info bullets */}
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 space-y-2">
                    {[
                      "Seats will be assigned after booking",
                      "Confirmation email will be sent immediately",
                      "Secure and safe payments",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-xs text-blue-700">
                        <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* ── Review Modal ── */}
      {showReview && (
        <ReviewModal
          flight={currentFlight}
          formData={formData}
          totalPrice={totalPrice}
          onBack={() => setShowReview(false)}
          onConfirm={handleProceedToPayment}
          loading={bookingLoading || isProcessing}
        />
      )}
    </>
  );
}