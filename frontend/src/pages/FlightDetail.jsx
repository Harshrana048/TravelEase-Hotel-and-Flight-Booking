import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getFlightById } from "../redux/slices/flightSlice";
import {
  initSocket,
  joinFlight,
  leaveFlight,
  onFlightBooked,
  onFlightCancelled,
  offFlightBooked,
  offFlightCancelled,
} from "../services/socket";

const calculateDuration = (departure, arrival) => {
  const diff = new Date(arrival) - new Date(departure);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ---------- presentational helpers (UI only, no data/logic changes) ---------- */

function PlaneIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2.5 1.8V22l3.5-1 3.5 1v-1.2L12 19v-5.5z" />
    </svg>
  );
}

function AmenityIcon({ type, className = "h-5 w-5" }) {
  const paths = {
    wifi: "M12 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM7 14.5a7 7 0 0110 0l-1.4 1.4a5 5 0 00-7.2 0zM3.5 11a12 12 0 0117 0l-1.4 1.4a10 10 0 00-14.2 0z",
    meal: "M6 2v9a2 2 0 002 2v9h2v-9a2 2 0 002-2V2H10v7H9V2H8v7H7V2zm11 0c-1.7 0-3 2.2-3 5s1.3 5 3 5v9h2V2z",
    entertainment:
      "M3 4h18a1 1 0 011 1v11a1 1 0 01-1 1h-6l2 3v1H7v-1l2-3H3a1 1 0 01-1-1V5a1 1 0 011-1zm1 2v9h16V6H4z",
    power: "M13 2L4 14h6l-1 8 9-12h-6z",
    legroom: "M8 3h3v9l3 8h3l-4-9V3h3l1 4h4l-2 6-2-1-2 1 1-6H10a2 2 0 01-2-2z",
    amenityKit:
      "M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z",
  };
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d={paths[type]} />
    </svg>
  );
}

const AMENITIES = [
  {
    key: "wifi",
    label: "High-speed Wi-Fi",
    desc: "Free for Business+ members",
  },
  { key: "meal", label: "Gourmet Meals", desc: "Chef-curated 3-course menu" },
  {
    key: "entertainment",
    label: "Entertainment",
    desc: "1000+ movies & live TV",
  },
  { key: "legroom", label: '32" Seat Pitch', desc: "Extra legroom available" },
  { key: "power", label: "Power Outlets", desc: "USB-C & Universal plugs" },
  { key: "amenityKit", label: "Amenity Kit", desc: "Sustainable comfort pack" },
];

function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentFlight, loading, error } = useSelector(
    (state) => state.flights,
  );
  const { token, user } = useSelector((state) => state.auth);
  const [availableSeats, setAvailableSeats] = useState(0);

  useEffect(() => {
    dispatch(getFlightById(id));
  }, [id, dispatch]);

  // ✅ Socket setup — with debug instrumentation
  useEffect(() => {
    const socket = initSocket();

    if (currentFlight?._id) {
      // ── Step 2: Room Join ────────────────────────────────────────────
      joinFlight(currentFlight._id);

      // ── Step 5: Frontend Listeners ──────────────────────────────────
      onFlightBooked((data) => {
        setAvailableSeats(data.availableSeats);
        toast.success(data.message);
      });

      // Listen for flight cancellations
      onFlightCancelled((data) => {
        setAvailableSeats(data.availableSeats);
        toast.info(data.message);
      });
    } else {
      console.warn(
        "[FlightDetail] ⚠️  currentFlight._id not available yet — socket join deferred",
      );
    }

    // ── Step 8: Cleanup ─────────────────────────────────────────────────
    return () => {
      if (currentFlight?._id) {
        console.group(
          "%c[FlightDetail] STEP 8 — Cleanup (component unmounting or flight changed)",
          "color:#f59e0b;font-weight:bold",
        );
        console.log("Leaving flight room for ID:", currentFlight._id);
        leaveFlight(currentFlight._id);
        offFlightBooked();
        offFlightCancelled(); // ✅ BUG FIX: was missing
        console.log("All flight listeners removed ✅");
        console.groupEnd();
      }
    };
  }, [currentFlight?._id]);

  // ── Step 6: Seed local state from Redux on initial load ────────────────────
  useEffect(() => {
    if (currentFlight?.availableSeats !== undefined) {
      console.log(
        "[FlightDetail] STEP 6 — Seeding availableSeats from Redux:",
        currentFlight.availableSeats,
        "(initial load only — real-time updates come from socket)",
      );
      setAvailableSeats(currentFlight.availableSeats);
    }
  }, [currentFlight?.availableSeats]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-primary"></div>
      </div>
    );
  }

  if (!currentFlight) {
    return (
      <div className="container py-24 text-center">
        <p className="text-xl text-gray-500 mb-3">Flight not found</p>
        <Link
          to="/flights"
          className="text-primary font-semibold hover:underline underline-offset-4"
        >
          Back to Flights
        </Link>
      </div>
    );
  }

  const flight = currentFlight;
  const duration = calculateDuration(flight.departureTime, flight.arrivalTime);
  const departureTimeLabel = new Date(flight.departureTime).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  const arrivalTimeLabel = new Date(flight.arrivalTime).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-6 md:py-15">
        {/* Back Link */}
        <Link
          to="/flights"
          className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors mb-6"
        >
          {/* Fixed sizing container - removed py-10 px-25 */}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 transition-transform group-hover:-translate-x-0.5">
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 stroke-current"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.7 15.7a1 1 0 01-1.4 0l-5-5a1 1 0 010-1.4l5-5a1 1 0 111.4 1.4L8.42 10l4.3 4.3a1 1 0 010 1.4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span>Back to Flights</span>
        </Link>

        <div className="mb-2 px-25 ">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Flight Details
          </h1>
          <p className="mt-1 text-gray-500">
            Review your selected flight itinerary before booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 px-25 ">
          {/* ---------- Main Content ---------- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Flight Header + Timeline */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <PlaneIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {flight.airline}
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Flight {flight.flightNumber}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 inline-flex items-center rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
                  {flight.class}
                </span>
              </div>

              {/* Timeline */}
              <div className="border-t border-gray-100 pt-8">
                <div className="grid grid-cols-3 items-center gap-4">
                  {/* Departure */}
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {departureTimeLabel}
                    </p>
                    <p className="text-lg font-semibold text-primary mt-1">
                      {flight.source}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDateTime(flight.departureTime)}
                    </p>
                  </div>

                  {/* Duration / route line */}
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs font-medium text-gray-400 mb-2">
                      {duration}
                    </p>
                    <div className="relative w-full flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      <span className="flex-1 border-t-2 border-dashed border-primary/40 mx-1"></span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shrink-0">
                        <PlaneIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 border-t-2 border-dashed border-primary/40 mx-1"></span>
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 mt-2">
                      Non-stop
                    </p>
                  </div>

                  {/* Arrival */}
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">
                      {arrivalTimeLabel}
                    </p>
                    <p className="text-lg font-semibold text-primary mt-1">
                      {flight.destination}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDateTime(flight.arrivalTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Information */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Flight Information
              </h2>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-gray-500 text-sm">Flight Number</span>
                  <span className="font-semibold text-gray-900">
                    {flight.flightNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-gray-500 text-sm">Airline</span>
                  <span className="font-semibold text-gray-900">
                    {flight.airline}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-gray-500 text-sm">Aircraft Class</span>
                  <span className="font-semibold text-gray-900">
                    {flight.class}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-gray-500 text-sm">Route</span>
                  <span className="font-semibold text-gray-900">
                    {flight.source} → {flight.destination}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-gray-500 text-sm">Available Seats</span>
                  <span
                    className={`font-semibold ${
                      availableSeats > 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {availableSeats > 0
                      ? `${availableSeats} seats`
                      : "No seats available"}
                  </span>
                </div>
              </div>
            </div>

            {/* In-flight Experience (static amenities, same across all flights) */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                In-flight Experience
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {AMENITIES.map((a) => (
                  <div
                    key={a.key}
                    className="flex flex-col items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 hover:bg-primary/5 hover:border-primary/20 hover:-translate-y-0.5 transition-all"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <AmenityIcon type={a.key} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {a.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8">
              {/* Header with Luggage Icon matching the theme */}
              <div className="flex items-center gap-2 mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">
                  Baggage Allowance
                </h2>
              </div>

              {/* Clean 2-column layout matching the flat amenities look */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-6">
                {/* Cabin Baggage Detail */}
                <div className="flex flex-col items-start gap-2">
                  <div className="text-gray-500 h-5 w-5 flex items-center justify-center">
                    {/* Simple Carry-on/Backpack type icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Cabin Baggage
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-normal">
                      1 x 7kg (56x36x23 cm) included per passenger
                    </p>
                  </div>
                </div>

                {/* Checked Baggage Detail */}
                <div className="flex flex-col items-start gap-2">
                  <div className="text-gray-500 h-5 w-5 flex items-center justify-center">
                    {/* Large suitcase type icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 9V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V9m-6 0h6m-6 0v10.5A1.5 1.5 0 0 0 10.5 21h3a1.5 1.5 0 0 0 1.5-1.5V9m-6 0H4.5A1.5 1.5 0 0 0 3 10.5v7.5A1.5 1.5 0 0 0 4.5 19h15a1.5 1.5 0 0 0 1.5-1.5v-7.5A1.5 1.5 0 0 0 19.5 9H15"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Checked Baggage
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-normal">
                      2 x 23kg standard check-in allowance included
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Sidebar Booking ---------- */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Price Details
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Per passenger, all fees included
              </p>

              {/* Price */}
              <div className="mb-5">
                <p className="text-4xl font-bold text-primary">
                  ₹{flight.price}
                </p>
              </div>

              {/* Availability Status Section */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                {availableSeats > 0 ? (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/40 px-3.5 py-1.5 text-xs font-bold shadow-sm shadow-emerald-600/5">
                    {/* Animated status dot element */}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>{availableSeats} Seats Available</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/40 px-3.5 py-1.5 text-xs font-bold shadow-sm shadow-rose-600/5">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    <span>Sold Out</span>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-3">
                <div>
                  <p className="text-gray-400 text-xs">Route</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">
                    {flight.source} → {flight.destination}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Duration</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">
                    {duration}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Departure</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">
                    {formatDateTime(flight.departureTime)}
                  </p>
                </div>
              </div>

              {/* Book Button — same logic/route as original */}
              {token ? (
                <Link
                  to={`/book-flight/${id}`}
                  className={`inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/10 transition-all duration-200 hover:bg-blue-700 active:scale-[0.99] ${
                    availableSeats > 0
                      ? "bg-primary text-black hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {availableSeats > 0 ? "Continue to Book" : "Unavailable"}
                  {availableSeats > 0 && (
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.3 4.3a1 1 0 011.4 0l5 5a1 1 0 010 1.4l-5 5a1 1 0 01-1.4-1.4L11.58 10 7.3 5.7a1 1 0 010-1.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/10 transition-all duration-200 hover:bg-blue-700 active:scale-[0.99]"
                >
                  Login to Book
                </Link>
              )}

              {/* Trust badges */}
              <div className="mt-5 space-y-2">
                <div className="flex items-start gap-2 rounded-xl bg-gray-50 p-3">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-5 w-5 text-primary shrink-0 mt-0.5"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1.5l6.5 2.6v5.2c0 4.6-2.8 8.4-6.5 9.7-3.7-1.3-6.5-5.1-6.5-9.7V4.1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Secure booking. Your details are protected and never shared.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightDetail;
