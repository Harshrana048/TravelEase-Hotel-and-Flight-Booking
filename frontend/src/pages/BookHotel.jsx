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

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
            contact: formData.contactPhone,
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

  if (hotelLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentHotel) {
    return (
      <div className="container py-8 text-center">
        <p className="text-xl text-gray-600">Hotel not found</p>
        <Link to="/hotels" className="text-primary font-bold hover:underline">
          Back to Hotels
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link
        to={`/hotels/${id}`}
        className="text-primary font-bold hover:underline mb-4 inline-block"
      >
        ← Back to Hotel
      </Link>

      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            {/* Dates */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Select Dates</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    min={today}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    min={formData.checkInDate || today}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Rooms */}
            <div className="mb-6 border-t pt-6">
              <label className="block font-medium mb-2">Number of Rooms</label>
              <select
                name="roomsBooked"
                value={formData.roomsBooked}
                onChange={handleInputChange}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
              >
                {Array.from({ length: currentHotel.roomsAvailable }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <p className="text-gray-600 text-sm mt-1">
                {currentHotel.roomsAvailable} rooms available
              </p>
            </div>

            {/* Guests */}
            <div className="mb-6 border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Guest Details</h2>
              <div className="space-y-4 mb-4">
                {formData.guests.map((guest, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded"
                  >
                    <div>
                      <label className="block font-medium text-sm mb-1">
                        Guest {index + 1} Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={guest.name}
                        onChange={(e) =>
                          handleGuestChange(index, "name", e.target.value)
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
                        value={guest.age}
                        onChange={(e) =>
                          handleGuestChange(index, "age", e.target.value)
                        }
                        min="1"
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      {formData.guests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGuest(index)}
                          className="w-full bg-danger text-white py-2 rounded font-medium hover:bg-red-700 transition text-sm"
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
                  className="text-primary font-medium hover:underline"
                >
                  + Add Guest
                </button>
              )}
            </div>

            {/* Contact */}
            <div className="mb-6 border-t pt-6">
              <label className="block font-medium mb-2">
                Contact Phone Number
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="+91-9876543210"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                required
              />
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

            {/* Hotel Info */}
            <div className="mb-6 pb-6 border-b">
              <img
                src={currentHotel.images?.[0]}
                alt={currentHotel.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="font-bold text-lg">{currentHotel.name}</h3>
              <p className="text-gray-600">{currentHotel.city}</p>
            </div>

            {/* Dates */}
            <div className="mb-4 pb-4 border-b">
              <p className="text-gray-600 text-sm">Check-in</p>
              <p className="font-semibold">
                {formData.checkInDate
                  ? new Date(formData.checkInDate).toDateString()
                  : "Not selected"}
              </p>
            </div>

            <div className="mb-4 pb-4 border-b">
              <p className="text-gray-600 text-sm">Check-out</p>
              <p className="font-semibold">
                {formData.checkOutDate
                  ? new Date(formData.checkOutDate).toDateString()
                  : "Not selected"}
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="mb-4 pb-4 border-b">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  ₹{currentHotel.pricePerNight}/night
                </span>
                <span className="font-semibold">× {nights || 0}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Rooms</span>
                <span className="font-semibold">× {formData.roomsBooked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests</span>
                <span className="font-semibold">{formData.guests.length}</span>
              </div>
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
                {nights} night{nights !== 1 ? "s" : ""} × {formData.roomsBooked}{" "}
                room
                {formData.roomsBooked !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Info */}
            <div className="bg-blue-50 p-4 rounded text-sm text-gray-600">
              <p className="mb-2">
                ✓ Free cancellation until 24 hours before check-in
              </p>
              <p>✓ Confirmation email will be sent after booking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
