import { Link } from "react-router-dom";

const AMENITY_ICONS = {
  wifi: "📶",
  pool: "🏊",
  parking: "🅿️",
  breakfast: "🥐",
  spa: "💆",
  gym: "🏋️",
};

function HotelCard({ hotel }) {
  return (
    <Link
      to={`/hotels/${hotel._id}`}
      className="group block overflow-hidden rounded-4xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden rounded-t-4xl bg-slate-200">
        {hotel.images?.[0] ? (
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-72 items-center justify-center text-slate-400">
            No Image
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur">
          ₹{hotel.pricePerNight}/night
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-slate-900/80 px-3 py-2 text-xs font-semibold text-white shadow-sm">
          {hotel.rating?.toFixed(1) || "0.0"} ⭐
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900 transition duration-200 group-hover:text-sky-600">
            {hotel.name}
          </h3>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
            {hotel.city}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          {hotel.amenities?.slice(0, 4).map((amenity, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2"
            >
              <span>{AMENITY_ICONS[amenity] || "✔️"}</span>
              <span className="capitalize">{amenity}</span>
            </span>
          ))}
          {hotel.amenities?.length > 4 && (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-500">
              +{hotel.amenities.length - 4} more
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Rooms available</p>
            <p
              className={`mt-1 font-semibold ${hotel.roomsAvailable > 0 ? "text-slate-900" : "text-rose-600"}`}
            >
              {hotel.roomsAvailable > 0
                ? `${hotel.roomsAvailable} rooms available`
                : "Sold Out"}
            </p>
          </div>
          <span className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition duration-200 group-hover:bg-sky-700">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
export default HotelCard;
