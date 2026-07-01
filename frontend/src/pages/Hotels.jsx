import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { HotelCard, HotelFilters } from "../components/index";
import { getHotels, setPage } from "../redux/slices/hotelSlice";

export default function Hotels() {
  const dispatch = useDispatch();
  const { hotels, loading, error, pages, currentPage, filters, total } =
    useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(getHotels({ ...filters, page: currentPage }));
  }, [filters, currentPage, dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 sm:px-10 lg:px-20 py-20">

        {/* Page header */}
        <section className="rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] mb-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Hotel Search
              </p>
              <h1 className="mt-3 text-4xl font-bold text-slate-900">
                Find your perfect stay
              </h1>
              <p className="mt-3 max-w-xl text-slate-500 leading-relaxed">
                Browse and filter properties, compare ratings, and book with
                confidence — all in one place.
              </p>
            </div>
            <div className="flex-shrink-0 rounded-2xl bg-blue-50 px-8 py-5 text-center">
              <p className="text-sm text-blue-500 font-medium">Available properties</p>
              <p className="mt-1 text-4xl font-bold text-blue-700">
                {total ?? hotels.length}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">

          {/* Sidebar */}
          <aside className="xl:sticky xl:top-28 self-start">
            <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <HotelFilters />
            </div>
          </aside>

          {/* Results */}
          <main>
            {/* Active filter chip */}
            {filters.city && (
              <div className="mb-6 flex items-center gap-2">
                <span className="text-sm text-slate-500">Showing results for</span>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  📍 {filters.city}
                </span>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="rounded-3xl bg-white p-14 shadow-sm flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />
              </div>
            )}

            {/* Empty state */}
            {!loading && hotels.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
                <p className="text-4xl">🏨</p>
                <p className="mt-4 text-xl font-semibold text-slate-900">
                  No hotels found
                </p>
                <p className="mt-2 text-slate-500">
                  Try adjusting your filters or searching a different city.
                </p>
              </div>
            )}

            {/* Hotel grid */}
            {!loading && hotels.length > 0 && (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {hotels.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => dispatch(setPage(currentPage - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← Prev
                    </button>

                    {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => dispatch(setPage(page))}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => dispatch(setPage(currentPage + 1))}
                      disabled={currentPage === pages}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}