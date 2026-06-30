import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BookingCard from './BookingCard';



function MyBookings() {

    const dispatch = useDispatch();
  const { hotelBookings, flightBookings, loading } = useSelector(
    (state) => state.dashboard
  );

    if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalBookings = hotelBookings.length + flightBookings.length;

     return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Total Bookings</p>
          <p className="text-3xl font-bold text-primary">{totalBookings}</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Hotel Bookings</p>
          <p className="text-3xl font-bold text-success">{hotelBookings.length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Flight Bookings</p>
          <p className="text-3xl font-bold text-purple-600">{flightBookings.length}</p>
        </div>
      </div>

      {/* Hotel Bookings */}
      {hotelBookings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">🏨 Hotel Bookings</h3>
          <div className="space-y-4">
            {hotelBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} type="hotel" />
            ))}
          </div>
        </div>
      )}

      {/* Flight Bookings */}
      {flightBookings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">✈ Flight Bookings</h3>
          <div className="space-y-4">
            {flightBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} type="flight" />
            ))}
          </div>
        </div>
      )}

      {/* No Bookings */}
      {totalBookings === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">No bookings yet</p>
          
           <a href="/hotels"
            className="text-primary font-bold hover:underline"
          >
            Start exploring and book your first trip! →
          </a>
        </div>
      )}
    </div>
  );
}

export default MyBookings
