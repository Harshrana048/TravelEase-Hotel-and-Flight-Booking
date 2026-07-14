import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  getHotels,
  setFilters as setHotelFilters,
  setPage as setHotelPage,
} from "../redux/slices/hotelSlice";
import {
  setFilters as setFlightFilters,
  setPage as setFlightPage,
} from "../redux/slices/flightSlice";
import { AISearchBox } from "../components";

const FEATURE_CARDS = [
  {
    title: "Best Price",
    description: "Competitive rates and honest pricing across top properties.",
    icon: "💰",
  },
  {
    title: "Secure Payment",
    description: "Safe checkout with trusted payment partners.",
    icon: "🔒",
  },
  {
    title: "Instant Confirmation",
    description: "Book now and receive instant confirmation details.",
    icon: "⚡",
  },
  {
    title: "24/7 Support",
    description: "Travel assistance available around the clock.",
    icon: "📞",
  },
];

const STATS = [
  { value: "10K+", label: "Hotels listed" },
  { value: "500+", label: "Destinations" },
  { value: "1M+", label: "Happy travellers" },
  { value: "4.9★", label: "Average rating" },
];

// Skeleton card for loading states
function HotelSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm animate-pulse">
      <div className="h-64 bg-slate-200" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-2/3 rounded-full bg-slate-200" />
        <div className="h-4 w-1/3 rounded-full bg-slate-100" />
        <div className="h-4 w-1/4 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, loading } = useSelector((state) => state.hotels);

  const [activeTab, setActiveTab] = useState("hotel");
  const [hotelSearch, setHotelSearch] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
  });
  const [flightSearch, setFlightSearch] = useState({
    source: "",
    destination: "",
    date: "",
  });

  useEffect(() => {
    dispatch(getHotels({ page: 1 ,limit:100}));
  }, [dispatch]);

  const destinationCards = useMemo(() => {
    const cityMap = new Map();
    console.log("Total hotels:", hotels.length);
    console.log(hotels.filter((hotel) => hotel.city === "Mumbai"));
    hotels.forEach((hotel) => {
      const city = hotel.city?.trim();
      if (!city) return;
      if (!cityMap.has(city)) {
        cityMap.set(city, { city, count: 0, image: hotel.images?.[0] || "" });
      }
      cityMap.get(city).count += 1;
    });
    return Array.from(cityMap.values()).slice(0, 5);
  }, [hotels]);

  const featuredHotels = useMemo(() => hotels.slice(0, 4), [hotels]);

  const handleHotelSearchChange = (e) => {
    const { name, value } = e.target;
    setHotelSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleFlightSearchChange = (e) => {
    const { name, value } = e.target;
    setFlightSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleHotelSearch = (e) => {
    e.preventDefault();
    dispatch(setHotelFilters(hotelSearch));
    dispatch(setHotelPage(1));
    navigate("/hotels");
  };

  const handleFlightSearch = (e) => {
    e.preventDefault();
    dispatch(setFlightFilters(flightSearch));
    dispatch(setFlightPage(1));
    navigate("/flights");
  };

  const handleDestinationClick = (city) => {
    dispatch(setHotelFilters({ city }));
    dispatch(setHotelPage(1));
    navigate("/hotels");
  };

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="images/home-bg.jpg"
            alt="Scenic travel destination"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-slate-900/70 to-slate-900/90" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-32 lg:pt-40">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-sky-300 backdrop-blur-sm">
            ✈ Premium travel, simplified
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Discover hotels & flights <br className="hidden sm:block" />
            <span className="text-sky-400">you'll actually love.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
            Curated stays and real flight availability — all in one place.
            Search, compare, and book with confidence.
          </p>

          {/* Stats row */}
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search card */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
            {/* Tab toggle */}
            <div className="inline-flex overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold">
              {["hotel", "flight"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab === "hotel" ? "🏨 Hotels" : "✈ Flights"}
                </button>
              ))}
            </div>

            {/* Hotel search */}
            {activeTab === "hotel" ? (
              <form
                onSubmit={handleHotelSearch}
                className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]"
              >
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Destination
                  </span>
                  <input
                    name="city"
                    value={hotelSearch.city}
                    onChange={handleHotelSearchChange}
                    placeholder="City, hotel or landmark"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Min price
                  </span>
                  <input
                    type="number"
                    name="minPrice"
                    value={hotelSearch.minPrice}
                    onChange={handleHotelSearchChange}
                    placeholder="₹ 0"
                    min={0}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Max price
                  </span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={hotelSearch.maxPrice}
                    onChange={handleHotelSearchChange}
                    placeholder="₹ 20,000"
                    min={0}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <button
                  type="submit"
                  className="self-end w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl active:scale-95"
                >
                  Search
                </button>
              </form>
            ) : (
              /* Flight search */
              <form
                onSubmit={handleFlightSearch}
                className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1.4fr_1fr_auto]"
              >
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    From
                  </span>
                  <input
                    name="source"
                    value={flightSearch.source}
                    onChange={handleFlightSearchChange}
                    placeholder="Departure city"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    To
                  </span>
                  <input
                    name="destination"
                    value={flightSearch.destination}
                    onChange={handleFlightSearchChange}
                    placeholder="Arrival city"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </span>
                  <input
                    type="date"
                    name="date"
                    value={flightSearch.date}
                    onChange={handleFlightSearchChange}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <button
                  type="submit"
                  className="self-end w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl active:scale-95"
                >
                  Search
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Popular Destinations ── */}
      {destinationCards.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Explore
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Popular destinations
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {destinationCards.map((dest) => (
              <button
                key={dest.city}
                onClick={() => handleDestinationClick(dest.city)}
                className="group relative overflow-hidden rounded-2xl bg-slate-100 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="h-44">
                  {dest.image ? (
                    <img
                      src={dest.image}
                      alt={dest.city}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-200 text-slate-400 text-sm">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-semibold text-white">{dest.city}</p>
                  <p className="text-xs text-white/70">
                    {dest.count} {dest.count === 1 ? "hotel" : "hotels"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Why TravelEase ── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Why us
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything you need, nothing you don't
            </h2>
            <p className="mt-4 text-slate-500">
              TravelEase is built for travellers who want clarity, speed, and
              honest pricing.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURE_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  {card.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Hotels ── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Handpicked
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Featured hotels
            </h2>
          </div>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
          >
            View all hotels
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {loading ? (
            <>
              <HotelSkeleton />
              <HotelSkeleton />
              <HotelSkeleton />
              <HotelSkeleton />
            </>
          ) : featuredHotels.length > 0 ? (
            featuredHotels.map((hotel) => (
              <Link
                key={hotel._id}
                to={`/hotels/${hotel._id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  {hotel.images?.[0] ? (
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {hotel.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-slate-500">
                        📍 {hotel.city}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-xl bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                      ₹{hotel.pricePerNight?.toLocaleString("en-IN")}
                      <span className="font-normal text-blue-500"> /night</span>
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                      <span className="text-yellow-400">⭐</span>
                      {hotel.rating?.toFixed(1) ?? "—"}
                    </span>
                    <span className="text-sm font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                      View details →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
              <p className="text-slate-500">
                No hotels available yet. Check back soon.
              </p>
              <Link
                to="/hotels"
                className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:underline"
              >
                Browse all hotels →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to plan your next trip?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            Thousands of hotels and flights are waiting. Start your search and
            book in minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/hotels"
              className="w-full sm:w-auto rounded-xl bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow transition hover:bg-slate-100 active:scale-95"
            >
              Browse Hotels
            </Link>
            <Link
              to="/flights"
              className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
            >
              Find Flights
            </Link>
          </div>
        </div>
        <AISearchBox />
      </section>
    </main>
  );
}
