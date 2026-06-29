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
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Filters</h3>

      {/* City Filter */}
      <div className="mb-6">
        <label className="block font-medium mb-2">City</label>
        <input
          type="text"
          placeholder="Enter city name"
          value={filters.city}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Minimum Rating</label>
        <select
          value={filters.rating}
          onChange={(e) => handleRatingChange(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:border-primary"
        >
          <option value="">Any Rating</option>
          <option value="3">3 stars & up</option>
          <option value="4">4 stars & up</option>
          <option value="5">5 stars</option>
        </select>
      </div>

      {/* Amenities Filter */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Amenities</label>
        <div className="space-y-2">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="w-4 h-4"
              />
              <span className="capitalize">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={handleClear}
        className="w-full bg-gray-300 text-gray-700 py-2 rounded font-medium hover:bg-gray-400 transition"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default HotelFilters;
