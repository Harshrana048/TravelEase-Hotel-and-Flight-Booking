import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FlightCard } from "../components/index";
import {
  getFlights,
  setFilters,
  clearFilters,
  setPage,
} from "../redux/slices/flightSlice";

function Flight() {
  const dispatch = useDispatch();
  const { flights, loading, error, pages, currentPage, filters } = useSelector(
    (state) => state.flights,
  );
  const [localFilters, setLocalFilters] = useState({
    source: "",
    destination: "",
    date: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters(localFilters));
  };

  const handleClearFilters = () => {
    setLocalFilters({ source: "", destination: "", date: "" });
    dispatch(clearFilters());
  };

  useEffect(() => {
    dispatch(getFlights({ ...filters, page: currentPage }));
  }, [filters, currentPage, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return( 
  
  <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Find Your Flight</h1>

      {/* Search Form */}
      <div className="bg-white p-6 rounded shadow-lg mb-8">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Source */}
          <div>
            <label className="block font-medium mb-2">From</label>
            <input
              type="text"
              name="source"
              placeholder="Departure city"
              value={localFilters.source}
              onChange={handleSearchChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block font-medium mb-2">To</label>
            <input
              type="text"
              name="destination"
              placeholder="Arrival city"
              value={localFilters.destination}
              onChange={handleSearchChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={localFilters.date}
              onChange={handleSearchChange}
              min={today}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 rounded font-bold hover:bg-blue-700 transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-bold hover:bg-gray-400 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* No Results */}
      {!loading && flights.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No flights found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Flights Grid */}
      {!loading && flights.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {flights.map((flight) => (
              <FlightCard key={flight._id} flight={flight} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => dispatch(setPage(currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>

              {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch(setPage(page))}
                  className={`px-4 py-2 rounded ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'border hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => dispatch(setPage(currentPage + 1))}
                disabled={currentPage === pages}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  

  );
}

export default Flight;
