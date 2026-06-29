import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getFlightById } from '../redux/slices/flightSlice';

const calculateDuration = (departure, arrival) => {
  const diff = new Date(arrival) - new Date(departure);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
function FlightDetail() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const  { currentFlight, loading, error } = useSelector((state) => state.flights);
    const {token ,user } = useSelector((state) => state.auth);

    useEffect(() => {
    dispatch(getFlightById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentFlight) {
    return (
      <div className="container py-8 text-center">
        <p className="text-xl text-gray-600">Flight not found</p>
        <Link to="/flights" className="text-primary font-bold hover:underline">
          Back to Flights
        </Link>
      </div>
    );
  }

   const flight = currentFlight;
  const duration = calculateDuration(flight.departureTime, flight.arrivalTime);
    return (
         <div className="container py-8">
      {/* Back Link */}
      <Link to="/flights" className="text-primary font-bold hover:underline mb-4 inline-block">
        ← Back to Flights
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Flight Header */}
          <div className="bg-white p-6 rounded shadow mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">{flight.airline}</h1>
                <p className="text-gray-600 text-lg">{flight.flightNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Class</p>
                <p className="text-2xl font-bold">{flight.class}</p>
              </div>
            </div>

            {/* Flight Timeline */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Departure */}
                <div>
                  <p className="text-gray-600 text-sm mb-2">Departure</p>
                  <p className="text-2xl font-bold">
                    {new Date(flight.departureTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-lg font-semibold">{flight.source}</p>
                  <p className="text-gray-600 text-sm">
                    {formatDateTime(flight.departureTime)}
                  </p>
                </div>

                {/* Duration */}
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-600 text-sm mb-2">Duration</p>
                  <p className="text-2xl font-bold">{duration}</p>
                  <div className="w-full h-1 bg-primary rounded my-4"></div>
                  <p className="text-gray-600 text-sm">Non-stop</p>
                </div>

                {/* Arrival */}
                <div className="text-right">
                  <p className="text-gray-600 text-sm mb-2">Arrival</p>
                  <p className="text-2xl font-bold">
                    {new Date(flight.arrivalTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-lg font-semibold">{flight.destination}</p>
                  <p className="text-gray-600 text-sm">
                    {formatDateTime(flight.arrivalTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Information */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Flight Information</h2>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-4">
                <span className="text-gray-600">Flight Number</span>
                <span className="font-semibold">{flight.flightNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="text-gray-600">Airline</span>
                <span className="font-semibold">{flight.airline}</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="text-gray-600">Aircraft Class</span>
                <span className="font-semibold">{flight.class}</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="text-gray-600">Route</span>
                <span className="font-semibold">
                  {flight.source} → {flight.destination}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Seats</span>
                <span className={`font-semibold ${
                  flight.availableSeats > 0 ? 'text-success' : 'text-danger'
                }`}>
                  {flight.availableSeats > 0
                    ? `${flight.availableSeats} seats`
                    : 'No seats available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Booking */}
        <div>
          <div className="bg-white p-6 rounded shadow sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Price Details</h2>

            {/* Price */}
            <div className="mb-6 pb-6 border-b">
              <p className="text-gray-600 text-sm mb-2">Price per Passenger</p>
              <p className="text-4xl font-bold text-primary">₹{flight.price}</p>
            </div>

            {/* Availability Status */}
            <div className="mb-6 pb-6 border-b">
              <p className="text-gray-600 text-sm mb-2">Availability</p>
              {flight.availableSeats > 0 ? (
                <p className="text-lg font-semibold text-success">
                  ✓ {flight.availableSeats} Seats Available
                </p>
              ) : (
                <p className="text-lg font-semibold text-danger">✗ Sold Out</p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded mb-6">
              <p className="text-gray-600 text-sm mb-1">Route</p>
              <p className="font-bold mb-3">
                {flight.source} → {flight.destination}
              </p>
              <p className="text-gray-600 text-sm mb-1">Duration</p>
              <p className="font-bold mb-3">{duration}</p>
              <p className="text-gray-600 text-sm mb-1">Departure</p>
              <p className="font-bold text-sm">
                {formatDateTime(flight.departureTime)}
              </p>
            </div>

            {/* Book Button */}
            {token ? (
              <Link
                to={`/book-flight/${id}`}
                className={`w-full py-3 rounded font-bold text-center block transition ${
                  flight.availableSeats > 0
                    ? 'bg-primary text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {flight.availableSeats > 0 ? 'Continue to Book' : 'Unavailable'}
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full bg-primary text-white py-3 rounded font-bold text-center block hover:bg-blue-700 transition"
              >
                Login to Book
              </Link>
            )}

            {/* Terms */}
            <p className="text-gray-600 text-xs mt-4 text-center">
              You will be able to add passengers and select seats on the next page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
        
    
}

export default FlightDetail
