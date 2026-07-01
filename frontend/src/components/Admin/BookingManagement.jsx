import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../../redux/slices/adminSlice";

function BookingManagement() {
  const dispatch = useDispatch();
  const { allBookings, loading } = useSelector((state) => state.admin);

  
  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);


  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
 const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
     <div>
      <h2 className="text-2xl font-bold mb-6">📅 All Bookings</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-bold">Booking ID</th>
              <th className="px-6 py-3 text-left font-bold">User</th>
              <th className="px-6 py-3 text-left font-bold">Type</th>
              <th className="px-6 py-3 text-left font-bold">Details</th>
              <th className="px-6 py-3 text-left font-bold">Amount</th>
              <th className="px-6 py-3 text-left font-bold">Status</th>
              <th className="px-6 py-3 text-left font-bold">Date</th>
            </tr>
          </thead>
          <tbody>
            {allBookings.map((booking) => (
              <tr key={booking._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">{booking._id.slice(-8)}</td>
                <td className="px-6 py-4">{booking.userId?.name || '-'}</td>
                <td className="px-6 py-4">
                  {booking.hotelId ? '🏨 Hotel' : '✈ Flight'}
                </td>
                <td className="px-6 py-4">
                  {booking.hotelId ? booking.hotelId.name : `${booking.flightId?.source} → ${booking.flightId?.destination}`}
                </td>
                <td className="px-6 py-4 font-bold">₹{booking.totalPrice}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(booking.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allBookings.length === 0 && (
        <div className="text-center py-8 text-gray-600">No bookings found</div>
      )}
    </div>
  );
}

export default BookingManagement;
