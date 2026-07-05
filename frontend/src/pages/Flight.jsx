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
  const { flights, loading, error, pages, currentPage, filters, total } =
    useSelector((state) => state.flights);
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

  const routeLabel =
    filters.source && filters.destination
      ? `${filters.source} → ${filters.destination}`
      : "All routes";

  const handleSwap = () => {
    setLocalFilters((prev) => ({
      source: prev.destination,
      destination: prev.source,
      date: prev.date,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 rounded-4xl bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">
                Flight Search
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">
                Browse flights with premium confidence
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600 leading-7">
                Search flights, compare fares, and book with a clean and modern
                travel experience.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-100 px-6 py-5 text-center shadow-sm">
              <p className="text-sm text-slate-500">Flights found</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {total || flights.length}
              </p>
            </div>
          </div>
        </div>

        <main>
          <div className="mb-6 rounded-4xl bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              Search route
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {routeLabel}
            </h2>
          </div>

          <div className="mb-8 rounded-4xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1.2fr_1fr_0.9fr]"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  From
                </label>
                <input
                  type="text"
                  name="source"
                  placeholder="Departure city"
                  value={localFilters.source}
                  onChange={handleSearchChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </div>
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_1fr_auto_auto] gap-4 items-end">
  

  {/* Swap Button */}
  <div className="flex justify-center">
  <button
    type="button"
    onClick={handleSwap}
    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8effd] text-[#1a2b49] transition hover:bg-[#dbe7fc] hover:rotate-180 duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    aria-label="Swap origin and destination"
  >
    {/* SVG matching the layout of image_0d54fc.png */}
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Top right-pointing arrow */}
      <path
        d="M6 9h12M18 9l-3-3m3 3l-3 3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom left-pointing arrow */}
      <path
        d="M18 15H6M6 15l3-3m-3 3l3 3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
</div>
  {/* To */}
  <div>
    <label className="block text-sm font-semibold text-slate-800 mb-2">
      To
    </label>
    <input
      type="text"
      name="destination"
      placeholder="Arrival city"
      value={localFilters.destination}
      onChange={handleSearchChange}
      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
    />
  </div>

  

 
</div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Departure Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={localFilters.date}
                  onChange={handleSearchChange}
                  min={today}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </div>

              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  className="w-full rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {loading && (
            <div className="rounded-4xl bg-white p-14 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-center">
                <div className="animate-spin h-14 w-14 rounded-full border-t-2 border-b-2 border-sky-500" />
              </div>
            </div>
          )}

          {!loading && flights.length === 0 && (
            <div className="rounded-4xl bg-white p-14 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <p className="text-xl font-semibold text-slate-900">
                No flights found
              </p>
              <p className="mt-3 text-slate-500">
                Try adjusting your search criteria.
              </p>
            </div>
          )}

          {!loading && flights.length > 0 && (
            <>
              <div className="space-y-5">
                {flights.map((flight) => (
                  <FlightCard key={flight._id} flight={flight} />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => dispatch(setPage(currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex h-11 min-w-30 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: pages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => dispatch(setPage(pageNum))}
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition ${
                          currentPage === pageNum
                            ? "bg-sky-600 text-white"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => dispatch(setPage(currentPage + 1))}
                    disabled={currentPage === pages}
                    className="inline-flex h-11 min-w-30 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Flight;
