import { Link } from 'react-router-dom';

const calculateDuration = (departure, arrival) => {
  const diff = new Date(arrival) - new Date(departure);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};



function FlightCard({flight}) {
    const duration = calculateDuration(flight.departureTime , flight.arrivalTime);

    return (
      <div className="bg-white rounded shadow-lg hover:shadow-2xl transition p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div>
          <h3 className="text-lg font-bold">{flight.airline}</h3>
          <p className="text-gray-600 text-sm">{flight.flightNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">₹{flight.price}</p>
          <p className="text-gray-600 text-sm">{flight.class}</p>
        </div>
      </div>

      {/* Flight Details */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Departure */}
        <div>
          <p className="text-gray-600 text-xs mb-1">Departure</p>
          <p className="text-xl font-bold">{formatTime(flight.departureTime)}</p>
          <p className="text-gray-600 text-sm font-medium">{flight.source}</p>
          <p className="text-gray-400 text-xs">{formatDate(flight.departureTime)}</p>
        </div>

        {/* Duration */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-600 text-xs mb-2">Duration</p>
          <p className="text-lg font-bold">{duration}</p>
          <div className="w-full h-1 bg-gray-300 rounded my-2"></div>
          <p className="text-gray-600 text-xs">Non-stop</p>
        </div>

        {/* Arrival */}
        <div className="text-right">
          <p className="text-gray-600 text-xs mb-1">Arrival</p>
          <p className="text-xl font-bold">{formatTime(flight.arrivalTime)}</p>
          <p className="text-gray-600 text-sm font-medium">{flight.destination}</p>
          <p className="text-gray-400 text-xs">{formatDate(flight.arrivalTime)}</p>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4 pb-4 border-b">
        <p className="text-sm text-gray-600">
          {flight.availableSeats > 0 ? (
            <span className="text-success font-medium">
              {flight.availableSeats} seats available
            </span>
          ) : (
            <span className="text-danger font-medium">Sold Out</span>
          )}
        </p>
      </div>

      {/* View Button */}
      <Link
        to={`/flights/${flight._id}`}
        className="w-full bg-primary text-white py-2 rounded font-bold text-center block hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>      
    );
}

export default FlightCard
