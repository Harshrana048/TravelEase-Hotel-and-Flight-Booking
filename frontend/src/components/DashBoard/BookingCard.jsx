import { useState } from 'react';
import toast from 'react-hot-toast';
import CancelBookingModal from './CancelBookingModal';
import api from '../../services/api'

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-success bg-opacity-10 text-success';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-danger bg-opacity-10 text-danger';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const downloadPDF = async (bookingId, bookingType) => {
  const toastId = toast.loading("Generating PDF...");

  try {
    const type =
      bookingType === "hotel" ? "HotelBooking" : "FlightBooking";

    const response = await api.get(
      `/bookings/download-ticket/${bookingId}?type=${type}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}-${bookingId}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    toast.dismiss(toastId);
    toast.success("Ticket downloaded successfully");
  } catch (err) {
    toast.dismiss(toastId);
    toast.error(
      err.response?.data?.message || "Failed to download ticket"
    );
  }
};


function BookingCard({booking,type}) {
    const [showCancelModal, setShowCancelModal] = useState(false);
  const isHotel = type === 'hotel';
    return (
           <>
      <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            {isHotel ? (
              <>
                <h3 className="text-xl font-bold">{booking.hotelId?.name}</h3>
                <p className="text-gray-600">{booking.hotelId?.city}</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold">
                  {booking.flightId?.source} → {booking.flightId?.destination}
                </h3>
                <p className="text-gray-600">
                  {booking.flightId?.airline} • {booking.flightId?.flightNumber}
                </p>
              </>
            )}
          </div>
          <span className={`px-3 py-1 rounded font-medium text-sm ${getStatusColor(booking.bookingStatus)}`}>
            {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
          {isHotel ? (
            <>
              <div>
                <p className="text-gray-600 text-sm">Check-in</p>
                <p className="font-semibold">
                  {new Date(booking.checkInDate).toDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Check-out</p>
                <p className="font-semibold">
                  {new Date(booking.checkOutDate).toDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Rooms</p>
                <p className="font-semibold">{booking.roomsBooked}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Guests</p>
                <p className="font-semibold">{booking.guests.length}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-gray-600 text-sm">Departure</p>
                <p className="font-semibold">
                  {new Date(booking.flightId?.departureTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Passengers</p>
                <p className="font-semibold">{booking.passengers.length}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Trip Type</p>
                <p className="font-semibold capitalize">{booking.tripType}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Seats</p>
                <p className="font-semibold">{booking.seatNumbers?.join(', ')}</p>
              </div>
            </>
          )}
        </div>

        {/* Price & Status */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-2xl font-bold text-primary">₹{booking.totalPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-sm">Payment Status</p>
            <p className={`font-semibold ${booking.paymentStatus === 'paid' ? 'text-success' : 'text-yellow-600'}`}>
              {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => downloadPDF(booking._id, type)}
            className="flex-1 bg-primary text-white py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            📄 Download PDF
          </button>
          {booking.bookingStatus === 'confirmed' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex-1 bg-danger text-white py-2 rounded font-medium hover:bg-red-700 transition"
            >
              Cancel Booking
            </button>
          )}
        </div>

        {/* Booking ID */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-gray-600 text-xs mb-1">Booking ID</p>
          <p className="font-mono text-sm">{booking._id}</p>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelBookingModal
          booking={booking}
          bookingType={type}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </>

    );
}

export default BookingCard
