import { Link } from "react-router-dom";
import BookingCard from "./BookingCard";
import EmptyState from "./EmptyState";

export default function UpcomingBookings({ bookings = [] }) {
  
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">
            Travel Plan
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Upcoming Bookings
          </h2>
        </div>
        <Link
          to="/dashboard"
          className="text-sm font-black text-blue-600 hover:text-blue-700"
        >
          View Details
        </Link>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No upcoming trips."
          subtitle="Confirmed and pending bookings will show up here."
          action="Book Flight"
          to="/flights"
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              type={booking.dashboardType}
              compact
            />
          ))}
        </div>
      )}
    </section>
  );
}
