import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {ReviewForm} from '../components/index';
import { getHotelById } from '../redux/slices/hotelSlice';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentHotel, loading, error } = useSelector((state) => state.hotels);
  const { token } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(getHotelById(id));
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

  if (!currentHotel) {
    return (
      <div className="container py-8 text-center">
        <p className="text-xl text-gray-600">Hotel not found</p>
        <Link to="/hotels" className="text-primary font-bold hover:underline">
          Back to Hotels
        </Link>
      </div>
    );
  }

  const hotel = currentHotel;

  return (
    <div className="container py-8">
      {/* Back Link */}
      <Link to="/hotels" className="text-primary font-bold hover:underline mb-4 inline-block">
        ← Back to Hotels
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="mb-4 bg-gray-200 rounded h-96 flex items-center justify-center overflow-hidden">
            {hotel.images?.[selectedImage] ? (
              <img
                src={hotel.images[selectedImage]}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>

          {/* Thumbnails */}
          {hotel.images && hotel.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {hotel.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-primary' : 'border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>

            {hotel.reviews && hotel.reviews.length > 0 ? (
              <div className="space-y-4 mb-8">
                {hotel.reviews.map((review, idx) => (
                  <div key={idx} className="bg-white p-4 rounded shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{review.userName}</h4>
                      <span className="text-yellow-500">
                        {'⭐'.repeat(review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mb-8">No reviews yet</p>
            )}

            {/* Review Form */}
            <ReviewForm hotelId={id} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div>
          <div className="bg-white p-6 rounded shadow sticky top-4">
            <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
            <p className="text-gray-600 mb-4">{hotel.city}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500">
                {'⭐'.repeat(Math.floor(hotel.rating))}
              </span>
              <span className="text-gray-600">({hotel.rating}/5)</span>
            </div>

            {/* Address */}
            <div className="mb-4">
              <h4 className="font-bold mb-1">Address</h4>
              <p className="text-gray-600">{hotel.address}</p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="font-bold mb-1">About</h4>
              <p className="text-gray-600">{hotel.description}</p>
            </div>

            {/* Price */}
            <div className="mb-4 border-t pt-4">
              <p className="text-3xl font-bold text-primary">
                ₹{hotel.pricePerNight}
                <span className="text-lg text-gray-600">/night</span>
              </p>
            </div>

            {/* Availability */}
            <div className="mb-4">
              {hotel.roomsAvailable > 0 ? (
                <p className="text-success font-medium">
                  {hotel.roomsAvailable} rooms available
                </p>
              ) : (
                <p className="text-danger font-medium">No rooms available</p>
              )}
            </div>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Book Button */}
            {token ? (
              <Link
                to={`/book-hotel/${id}`}
                className={`w-full py-3 rounded font-bold text-center block transition ${
                  hotel.roomsAvailable > 0
                    ? 'bg-primary text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {hotel.roomsAvailable > 0 ? 'Book Now' : 'Unavailable'}
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full bg-primary text-white py-3 rounded font-bold text-center block hover:bg-blue-700 transition"
              >
                Login to Book
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}