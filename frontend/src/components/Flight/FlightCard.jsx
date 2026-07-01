import { Link } from "react-router-dom";

const calculateDuration = (departure, arrival) => {
  const diff = new Date(arrival) - new Date(departure);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function FlightCard({ flight }) {
  const duration = calculateDuration(flight.departureTime, flight.arrivalTime);
  const flightStops = flight.stops !== undefined ? flight.stops : null;
  const stopLabel =
    flightStops === 0
      ? "Non-stop"
      : flightStops
        ? `${flightStops} stop${flightStops > 1 ? "s" : ""}`
        : "Direct";

  return (
    <Link
      to={`/flights/${flight._id}`}
      className="group grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-sky-300 hover:shadow-lg"
    >
      {/* Airline */}
      <div className="flex items-center gap-4 lg:w-56">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg font-bold text-slate-700">
          {flight.logo ? (
            <img
              src={flight.logo}
              alt={flight.airline}
              className="h-9 w-9 object-contain"
            />
          ) : (
            flight.airline?.slice(0, 2).toUpperCase() || "FL"
          )}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{flight.airline}</p>
          <p className="text-sm text-slate-500">
            {flight.flightNumber} · {flight.class}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between gap-4 lg:gap-8">
        <div className="text-left">
          <p className="text-xl font-bold text-slate-900 tabular-nums">
            {formatTime(flight.departureTime)}
          </p>
          <p className="text-sm text-slate-500">{flight.source}</p>
        </div>

        <div className="flex flex-1 flex-col items-center px-2">
          <p className="text-xs text-slate-500">{duration}</p>
          <div className="relative my-1.5 h-px w-full min-w-15 bg-slate-300">
            <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-sky-600" />
            <div className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-sky-600" />
          </div>
          <p className="text-xs font-medium text-slate-500">{stopLabel}</p>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-slate-900 tabular-nums">
            {formatTime(flight.arrivalTime)}
          </p>
          <p className="text-sm text-slate-500">{flight.destination}</p>
        </div>
      </div>

      {/* Price / action */}
      <div className="flex flex-col items-start gap-2 lg:items-end lg:border-l lg:border-slate-100 lg:pl-6">
        <p className="text-xs text-slate-400">{formatDate(flight.departureTime)}</p>
        <p className="text-2xl font-bold text-slate-900">
          ₹{flight.price}
          <span className="ml-1 text-xs font-normal text-slate-400">/ person</span>
        </p>
        <p className="text-xs text-slate-500">{flight.availableSeats ?? 0} seats left</p>
        <span className="mt-1 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition group-hover:bg-sky-700">
          Select
        </span>
      </div>
    </Link>
  );
}

export default FlightCard;