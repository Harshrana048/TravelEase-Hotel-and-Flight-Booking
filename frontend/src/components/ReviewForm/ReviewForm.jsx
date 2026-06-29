import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addReview } from '../../redux/slices/hotelSlice';

function ReviewForm({ hotelId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.hotels);
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Please login to add a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await dispatch(addReview({ hotelId, reviewData: { rating, comment } })).unwrap();
      toast.success('Review added successfully');
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error(err || 'Failed to add review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Add Your Review</h3>

      {!token && (
        <p className="text-yellow-600 mb-4">Please login to add a review</p>
      )}

      <div className="mb-4">
        <label className="block font-medium mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows="4"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:border-primary"
          disabled={!token}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !token}
        className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Adding Review...' : 'Add Review'}
      </button>
    </form>
  );
}
export default ReviewForm