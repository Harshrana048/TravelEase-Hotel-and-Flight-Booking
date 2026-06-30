import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getWishlist, removeFromWishlist } from '../../redux/slices/dashboardSlice';
import { Link } from 'react-router-dom';

export default function WishlistSection() {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = async (itemId, type) => {
    try {
      await dispatch(removeFromWishlist({ itemId, type })).unwrap();
      toast.success(`Removed from wishlist`);
    } catch (err) {
      toast.error(err || 'Failed to remove from wishlist');
    }
  };

  const totalWishlist = (wishlist.hotels?.length || 0) + (wishlist.flights?.length || 0);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-pink-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Total Wishlist Items</p>
          <p className="text-3xl font-bold text-pink-600">{totalWishlist}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Saved Hotels</p>
          <p className="text-3xl font-bold text-primary">{wishlist.hotels?.length || 0}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Saved Flights</p>
          <p className="text-3xl font-bold text-purple-600">{wishlist.flights?.length || 0}</p>
        </div>
      </div>

      {/* Hotels */}
      {wishlist.hotels && wishlist.hotels.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">🏨 Saved Hotels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.hotels.map((hotel) => (
              <div key={hotel._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                <div className="mb-3 bg-gray-200 rounded h-32 overflow-hidden">
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
                </div>
                <h4 className="font-bold text-lg mb-1">{hotel.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{hotel.city}</p>
                <p className="font-bold text-primary mb-3">₹{hotel.pricePerNight}/night</p>
                <div className="flex gap-2">
                  <Link
                    to={`/hotels/${hotel._id}`}
                    className="flex-1 bg-primary text-white py-2 rounded text-center font-medium hover:bg-blue-700 transition text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleRemove(hotel._id, 'hotel')}
                    className="flex-1 bg-danger text-white py-2 rounded font-medium hover:bg-red-700 transition text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flights */}
      {wishlist.flights && wishlist.flights.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">✈ Saved Flights</h3>
          <div className="grid grid-cols-1 gap-4">
            {wishlist.flights.map((flight) => (
              <div key={flight._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{flight.airline}</h4>
                    <p className="text-gray-600 text-sm">{flight.flightNumber}</p>
                  </div>
                  <p className="text-primary font-bold">₹{flight.price}</p>
                </div>
                <p className="text-gray-600 mb-3">
                  {flight.source} → {flight.destination}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/flights/${flight._id}`}
                    className="flex-1 bg-primary text-white py-2 rounded text-center font-medium hover:bg-blue-700 transition text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleRemove(flight._id, 'flight')}
                    className="flex-1 bg-danger text-white py-2 rounded font-medium hover:bg-red-700 transition text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Wishlist Items */}
      {totalWishlist === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">Your wishlist is empty</p>
          <div className="flex gap-4 justify-center">
            
             <Link to ="/hotels"
              className="text-primary font-bold hover:underline"
            >
              Save Hotels →
            </Link>
            
            <Link to="/flights"
              className="text-primary font-bold hover:underline"
            >

              Save Flights →
        </Link>
          </div>
        </div>
      )}
    </div>
  );
}