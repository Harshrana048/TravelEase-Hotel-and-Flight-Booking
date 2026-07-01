import { useSelector, useDispatch } from "react-redux";
import { setFilters, clearFilters } from "../../redux/slices/hotelSlice";

const AMENITIES = ["wifi", "pool", "parking", "breakfast", "spa", "gym"];

function HotelFilters() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.hotels.filters);

  const handleCityChange = (city) => {
    dispatch(setFilters({ city }));
  };

  const handlePriceChange = (type, value) => {
    if (type === "min") {
      dispatch(setFilters({ minPrice: value }));
    } else {
      dispatch(setFilters({ maxPrice: value }));
    }
  };
  const handleRatingChange = (rating) => {
    dispatch(setFilters({ rating }));
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    dispatch(setFilters({ amenities: newAmenities }));
  };

  const handleClear = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="mb-6 border-b border-slate-200 pb-5">
        <h3 className="text-2xl font-semibold text-slate-900">Filters</h3>
        <p className="mt-2 text-sm text-slate-500">
          Refine hotels by location, price, rating and amenities.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            City
          </label>
          <input
            type="text"
            placeholder="Enter city name"
            value={filters.city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Price Range
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Minimum Rating
          </label>
          <select
            value={filters.rating}
            onChange={(e) => handleRatingChange(e.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
          >
            <option value="">Any Rating</option>
            <option value="3">3 stars & up</option>
            <option value="4">4 stars & up</option>
            <option value="5">5 stars</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-4">
            Amenities
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {AMENITIES.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className={`flex items-center justify-between rounded-3xl border px-4 py-3 text-left text-sm font-medium transition ${
                  filters.amenities.includes(amenity)
                    ? "border-sky-500 bg-sky-50 text-slate-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="capitalize">{amenity}</span>
                <span className="text-slate-500">
                  {filters.amenities.includes(amenity) ? "✓" : ""}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleClear}
          className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default HotelFilters;
