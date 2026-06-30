import { useLocation, Link } from 'react-router-dom';

export default function PaymentFailure() {
  const location = useLocation();
  const state = location.state || {};

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow-lg text-center">
        <div className="text-6xl mb-4">✗</div>
        <h1 className="text-3xl font-bold text-danger mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          {state.error || 'Unfortunately, your payment could not be processed. Please try again.'}
        </p>

        <div className="space-y-3">
          <Link
            to="/hotels"
            className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-700 transition block"
          >
            Continue Browsing Hotels
          </Link>
          <Link
            to="/flights"
            className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-700 transition block"
          >
            Continue Browsing Flights
          </Link>
          <Link
            to="/"
            className="w-full bg-gray-300 text-gray-700 py-3 rounded font-bold hover:bg-gray-400 transition block"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-gray-600 text-sm mt-6">
          If you need help, contact support@travelease.com
        </p>
      </div>
    </div>
  );
}