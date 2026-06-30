import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getFlightById } from "../redux/slices/flightSlice";
import {
  bookFlight,
  createPaymentOrder,
  verifyPayment,
} from "../redux/slices/bookingSlice";

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function BookFlight() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentFlight, loading: flightLoading } = useSelector(
    (state) => state.flights,
  );
  const { loading: bookingLoading } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    passengers: [{ name: "", phone: "", age: "" }],
    tripType: "one-way",
    returnFlightId: "",
  });

  const [returnFlight, setReturnFlight] = useState(null);

  useEffect(() => {
    dispatch(getFlightById(id));
  }, [id, dispatch]);

 const handlePassengerChange = (index, field, value) => {
  const newPassengers = [...formData.passengers];

  newPassengers[index] = {
    ...newPassengers[index],
    [field]: value,
  };

  setFormData({
    ...formData,
    passengers: newPassengers,
  });
};
  const addPassenger = () => {
    if (
      currentFlight &&
      formData.passengers.length < currentFlight.availableSeats
    ) {
      setFormData({
        ...formData,
        passengers: [...formData.passengers, { name: "", phone: "", age: "" }],
      });
    } else {
      toast.error("Cannot add more passengers than available seats");
    }
  };

  const removePassenger = (index) => {
    setFormData({
      ...formData,
      passengers: formData.passengers.filter((_, i) => i !== index),
    });
  };

  const handleReturnFlightSelect = (e) => {
    const selectedId = e.target.value;
    setFormData({ ...formData, returnFlightId: selectedId });
    // In real app, fetch return flight details
  };

  const calculateTotalPrice = () => {
    if (!currentFlight) return 0;
    let total = currentFlight.price * formData.passengers.length;
    if (formData.tripType === "round-trip" && returnFlight) {
      total += returnFlight.price * formData.passengers.length;
    }
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.passengers.some((p) => !p.name || !p.phone || !p.age)) {
      toast.error("Please fill all passenger details");
      return;
    }

    if (formData.tripType === "round-trip" && !formData.returnFlightId) {
      toast.error("Please select a return flight");
      return;
    }

    try {
      const result = await dispatch(
        bookFlight({
          flightId: id,
          passengers: formData.passengers,
          tripType: formData.tripType,
          returnFlightId: formData.returnFlightId || undefined,
        }),
      ).unwrap();

      toast.success("Flight booked successfully! Proceeding to payment...");

      // Create payment order
      const paymentResult = await dispatch(
        createPaymentOrder({
          bookingId: result._id,
          bookingType: "FlightBooking",
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
          description: `Flight Booking - ${currentFlight.flightNumber}`,
          order_id: paymentResult.orderId,
          handler: async (response) => {
            try {
              console.log("🎉 Razorpay Success:", response);

              const verifyResult = await dispatch(
                verifyPayment({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  bookingId: result._id,
                  bookingType: "HotelBooking",
                }),
              ).unwrap();

              console.log("✅ Verification complete:", verifyResult);

              toast.success("Payment verified! Redirecting...");

              setTimeout(() => {
                navigate("/payment-success", {
                  state: { bookingId: result._id, bookingType: "HotelBooking" },
                });
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
              }, 1000);
            }
          },
          prefill: {
            email: user?.email,
            contact: formData.passengers[0]?.phone,
          },
          theme: {
            color: "#1d4ed8",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
    } catch (err) {
      // ✅ CORRECT
      const errorMsg =
        typeof err === "string" ? err : err?.message || "Failed to book hotel";
      toast.error(errorMsg);
    }
  };

  if (flightLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentFlight) {
    return (
      <div className="container py-8 text-center">
        <p className="text-xl text-gray-600">Flight not found</p>
        <Link to="/flights" className="text-primary font-bold hover:underline">
          Back to Flights
        </Link>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="container py-8">
      <Link
        to={`/flights/${id}`}
        className="text-primary font-bold hover:underline mb-4 inline-block"
      >
        ← Back to Flight
      </Link>

      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            {/* Trip Type */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Trip Type</h2>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tripType"
                    value="one-way"
                    checked={formData.tripType === "one-way"}
                    onChange={(e) =>
                      setFormData({ ...formData, tripType: e.target.value })
                    }
                    className="mr-2"
                  />
                  One Way
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tripType"
                    value="round-trip"
                    checked={formData.tripType === "round-trip"}
                    onChange={(e) =>
                      setFormData({ ...formData, tripType: e.target.value })
                    }
                    className="mr-2"
                  />
                  Round Trip
                </label>
              </div>
            </div>

            {/* Return Flight Selection (if round-trip) */}
            {formData.tripType === "round-trip" && (
              <div className="mb-6 border-t pt-6">
                <label className="block font-medium mb-2">
                  Select Return Flight
                </label>
                <select
                  value={formData.returnFlightId}
                  onChange={handleReturnFlightSelect}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                  required
                >
                  <option value="">Choose a return flight</option>
                  {/* In real app, fetch and list available return flights */}
                  <option value="flight-2">Sample Return Flight</option>
                </select>
              </div>
            )}

            {/* Passengers */}
            <div className="mb-6 border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Passenger Details</h2>
              <div className="space-y-4 mb-4">
                {formData.passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded"
                  >
                    <div>
                      <label className="block font-medium text-sm mb-1">
                        Passenger {index + 1} Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={passenger.name}
                        onChange={(e) =>
                          handlePassengerChange(index, "name", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-sm mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={passenger.phone}
                        onChange={(e) =>
                          handlePassengerChange(index, "phone", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-sm mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="Age"
                        value={passenger.age}
                        onChange={(e) =>
                          handlePassengerChange(index, "age", e.target.value)
                        }
                        min="1"
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      {formData.passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePassenger(index)}
                          className="w-full bg-danger text-white py-2 rounded font-medium hover:bg-red-700 transition text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {formData.passengers.length < currentFlight.availableSeats && (
                <button
                  type="button"
                  onClick={addPassenger}
                  className="text-primary font-medium hover:underline"
                >
                  + Add Passenger
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {bookingLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white p-6 rounded shadow sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>

            {/* Flight Info */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{currentFlight.airline}</h3>
                  <p className="text-gray-600 text-sm">
                    {currentFlight.flightNumber}
                  </p>
                </div>
                <p className="text-primary font-bold">{currentFlight.class}</p>
              </div>

              <div className="mt-4">
                <p className="text-gray-600 text-sm mb-1">
                  {currentFlight.source} → {currentFlight.destination}
                </p>
                <p className="font-semibold">
                  {formatTime(currentFlight.departureTime)} -{" "}
                  {formatTime(currentFlight.arrivalTime)}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mb-4 pb-4 border-b">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  ₹{currentFlight.price} × {formData.passengers.length}
                </span>
                <span className="font-semibold">
                  ₹{currentFlight.price * formData.passengers.length}
                </span>
              </div>
              {formData.tripType === "round-trip" && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Return Flight</span>
                  <span className="font-semibold">
                    ₹
                    {returnFlight
                      ? returnFlight.price * formData.passengers.length
                      : 0}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-600">Total Amount</span>
                <span className="text-3xl font-bold text-primary">
                  ₹{totalPrice}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                {formData.passengers.length} passenger
                {formData.passengers.length !== 1 ? "s" : ""}
                {formData.tripType === "round-trip"
                  ? " • Round Trip"
                  : " • One Way"}
              </p>
            </div>

            {/* Info */}
            <div className="bg-blue-50 p-4 rounded text-sm text-gray-600">
              <p className="mb-2">✓ Seats will be assigned after booking</p>
              <p>✓ Confirmation email will be sent immediately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
