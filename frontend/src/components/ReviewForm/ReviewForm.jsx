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
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 max-w-md mx-auto"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-1">Add Your Review</h3>
      <p className="text-xs text-gray-500 mb-6">Let us know about your overall experience with our service.</p>

      {/* Styled Alert Banner for missing token authentication */}
      {!token && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/60 rounded-xl p-3 mb-6 text-amber-800 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 shrink-0 text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span className="font-medium">Please sign in to share a rating and review.</span>
        </div>
      )}

      {/* Dynamic Star Input Group */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating</label>
        <div className={`flex gap-1 items-center ${!token ? 'opacity-40 pointer-events-none' : ''}`}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isSelected = rating >= star;
            return (
              <button
                key={star}
                type="button"
                disabled={!token}
                onClick={() => setRating(star)}
                className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:scale-110 active:scale-95 transition-all duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isSelected ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={`w-9 h-9 transition-all duration-200 cursor-pointer
                    ${
                      isSelected
                        ? 'text-amber-400 drop-shadow-[0_2px_5px_rgba(251,191,36,0.35)]'
                        : 'text-gray-200 hover:text-amber-400 hover:scale-105'
                    }
                  `}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499c.151-.312.59-.312.74 0l2.422 4.904 5.38.782c.345.05.484.473.235.717l-3.896 3.797 1.22 5.347a.438.438 0 0 1-.616.48l-4.755-2.503-4.756 2.503a.438.438 0 0 1-.616-.48l1.22-5.347-3.897-3.797a.439.439 0 0 1 .235-.717l5.38-.782 2.42-4.904Z"
                  />
                </svg>
              </button>
            );
          })}
          {rating > 0 && <span className="ml-2 text-sm font-semibold text-gray-600">{rating} / 5</span>}
        </div>
      </div>

      {/* Comment Input Group */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={token ? "Tell us what you liked or how we can improve..." : "Sign in to leave feedback..."}
          rows="4"
          className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed resize-none"
          disabled={!token}
        />
      </div>

      {/* Action Submit Button with Loading Spinner */}
      <button
        type="submit"
        disabled={loading || !token || !rating}
        className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-md hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-blue-600"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Submitting Review...</span>
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}

export default ReviewForm;