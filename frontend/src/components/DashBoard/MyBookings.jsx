import { useSelector } from "react-redux";
import BookingCard from "./BookingCard";
import EmptyState from "./EmptyState";

export default function MyBookings({
  hotelBookings: providedHotelBookings,
  flightBookings: providedFlightBookings,
}) {
  const dashboard = useSelector((state) => state.dashboard);
  const hotelBookings = providedHotelBookings ?? dashboard.hotelBookings ?? [];
  const flightBookings = providedFlightBookings ?? dashboard.flightBookings ?? [];
  const totalBookings = hotelBookings.length + flightBookings.length;

  if (dashboard.loading && !providedHotelBookings && !providedFlightBookings) {
    return (
      <div className="flex min-h-95 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      </div>
    );
  }

  if (totalBookings === 0) {
    return <EmptyState title="No bookings yet." action="Explore Hotels" to="/hotels" />;
  }

  return (
    <div className="space-y-8">
      {hotelBookings.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">
                Stays
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Hotel Bookings
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
              {hotelBookings.length}
            </span>
          </div>
          <div className="space-y-4">
            {hotelBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} type="hotel" />
            ))}
          </div>
        </section>
      )}

      {flightBookings.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">
                Flights
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Flight Bookings
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
              {flightBookings.length}
            </span>
          </div>
          <div className="space-y-4">
            {flightBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} type="flight" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
