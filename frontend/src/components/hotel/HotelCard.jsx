import { Link } from 'react-router-dom';

 function HotelCard({ hotel }) {
  return (
    <div className="bg-white rounded shadow-lg overflow-hidden hover:shadow-2xl transition">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {hotel.images?.[0] ? (
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-4 right-4 bg-secondary text-black px-3 py-1 rounded font-bold">
          ₹{hotel.pricePerNight}/night
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 truncate">{hotel.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{hotel.city}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-500">
            {'⭐'.repeat(Math.floor(hotel.rating))}
          </span>
          <span className="text-sm text-gray-600">({hotel.rating}/5)</span>
        </div>

        {/* Amenities Preview */}
        <div className="flex gap-1 flex-wrap mb-4">
          {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities?.length > 3 && (
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Availability */}
        <p className="text-sm text-gray-600 mb-4">
          {hotel.roomsAvailable > 0 ? (
            <span className="text-success font-medium">
              {hotel.roomsAvailable} rooms available
            </span>
          ) : (
            <span className="text-danger font-medium">Sold Out</span>
          )}
        </p>

        {/* View Button */}
        <Link
          to={`/hotels/${hotel._id}`}
          className="w-full bg-primary text-white py-2 rounded font-bold text-center hover:bg-blue-700 transition block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
export default HotelCard