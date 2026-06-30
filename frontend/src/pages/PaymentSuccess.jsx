import { useLocation, Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const location = useLocation();
  const state = location.state || {};

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow-lg text-center">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-success mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-2">Your payment has been received and processed.</p>
        <p className="text-gray-600 mb-6">
          Confirmation email has been sent to your registered email address.
        </p>

        {state.bookingId && (
          <div className="bg-gray-50 p-4 rounded mb-6">
            <p className="text-gray-600 text-sm mb-1">Booking ID</p>
            <p className="font-mono font-bold text-lg">{state.bookingId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-700 transition block"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="w-full bg-gray-300 text-gray-700 py-3 rounded font-bold hover:bg-gray-400 transition block"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-gray-600 text-sm mt-6">
          Thank you for using TravelEase!
        </p>
      </div>
    </div>
  );
}