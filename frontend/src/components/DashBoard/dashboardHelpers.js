export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getBookingName = (booking, type) =>
  type === "hotel"
    ? booking.hotelId?.name || "Hotel booking"
    : booking.flightId?.airline || "Flight booking";

export const getBookingRoute = (booking, type) =>
  type === "hotel"
    ? booking.hotelId?.city || booking.hotelId?.address || "Hotel stay"
    : `${booking.flightId?.source || "Origin"} to ${
        booking.flightId?.destination || "Destination"
      }`;

export const getTravelDate = (booking, type) =>
  type === "hotel" ? booking.checkInDate : booking.flightId?.departureTime;

export const getBookingTypeLabel = (type) =>
  type === "hotel" ? "Hotel" : "Flight";

export const getInitials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

export const getStatusClasses = (status = "pending") => {
  const normalized = status.toLowerCase();

  if (normalized === "paid" || normalized === "confirmed") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (normalized === "cancelled" || normalized === "refunded") {
    return "bg-rose-50 text-rose-700 ring-rose-100";
  }

  if (normalized === "refund_pending") {
    return "bg-orange-50 text-orange-700 ring-orange-100";
  }

  return "bg-amber-50 text-amber-700 ring-amber-100";
};

export const prettyStatus = (status = "pending") =>
  status.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
