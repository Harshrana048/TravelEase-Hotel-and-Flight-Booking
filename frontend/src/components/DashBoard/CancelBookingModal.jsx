import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { cancelAndRefundBooking } from '../redux/slices/dashboardSlice';

export default function CancelBookingModal({ booking, bookingType, onClose }) {
  const dispatch = useDispatch();

  const handleCancel = async () => {
    try {
     
      const paymentId = booking.paymentId;
      
      if (!paymentId) {
        toast.error('Payment ID not found. Cannot process refund.');
        return;
      }

      await dispatch(
        cancelAndRefundBooking(paymentId)
      ).unwrap();
      
      toast.success('Booking cancelled! Refund initiated. You will receive it in 3-5 business days.');
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to cancel booking and refund');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Cancel Booking?</h2>

        <div className="bg-yellow-50 p-4 rounded mb-4 border border-yellow-200">
          <p className="text-yellow-800 text-sm mb-2">
            <strong>Important:</strong> Cancelling this booking will:
          </p>
          <ul className="text-yellow-800 text-sm space-y-1 ml-4 list-disc">
            <li>Mark booking as cancelled</li>
            <li>Process a full refund to your original payment method</li>
            <li>Refund will appear in 3-5 business days</li>
            <li>Rooms/seats will be made available again</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded mb-6">
          <p className="text-gray-600 text-sm mb-1">Refund Amount</p>
          <p className="text-2xl font-bold text-success">₹{booking.totalPrice}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-bold hover:bg-gray-400 transition"
          >
            Keep Booking
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-danger text-white py-2 rounded font-bold hover:bg-red-700 transition"
          >
            Yes, Cancel & Refund
          </button>
        </div>
      </div>
    </div>
  );
}