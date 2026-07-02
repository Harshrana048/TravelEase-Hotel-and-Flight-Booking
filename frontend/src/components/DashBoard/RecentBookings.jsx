import { Link } from "react-router-dom";
import BookingCard from "./BookingCard";
import EmptyState from "./EmptyState";

export default function RecentBookings({
  title = "Recent Bookings",
  bookings = [],
  compact = false,
  showPaymentAction = false,
  emptyTitle = "No bookings yet.",
  emptyAction = "Explore Hotels",
  emptyActionTo = "/hotels",
}) {
  return (
    
      <section>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              type={booking.dashboardType}
              compact={compact}
              showPaymentAction={showPaymentAction}
            />
          ))}
        </div>
      
    </section>
  )
  
}
