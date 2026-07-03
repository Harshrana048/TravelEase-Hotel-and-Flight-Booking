import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ReviewForm } from "../components/index";
import { getHotelById } from "../redux/slices/hotelSlice";
import {
  initSocket,
  joinHotel,
  leaveHotel,
  onRoomBooked,
  onRoomCancelled,
  offRoomBooked,
  offRoomCancelled,
  getSocket,
} from "../services/socket";

function StarRating({ value = 0 }) {
  const full = Math.floor(value);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < full ? "fill-amber-400" : "fill-gray-200"}`}
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.74 1-5.8-4.21-4.1 5.82-.85z" />
        </svg>
      ))}
    </span>
  );
}

function LocationIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 2a6 6 0 00-6 6c0 4.2 6 10 6 10s6-5.8 6-10a6 6 0 00-6-6zm0 8.25A2.25 2.25 0 1110 5.75a2.25 2.25 0 010 4.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function AmenityIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.9 3.9 6.7-6.7a1 1 0 011.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function HotelDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentHotel, loading, error } = useSelector((state) => state.hotels);
  const { token } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [roomsAvailable, setRoomsAvailable] = useState(0);

  useEffect(() => {
    dispatch(getHotelById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    dispatch(getHotelById(id));
  }, [dispatch, id]);

  // ✅ Socket setup — with debug instrumentation
  useEffect(() => {
    

    const socket = initSocket();

    if (currentHotel?._id) {
      // ── Step 2: Room Join ────────────────────────────────────────────
      joinHotel(currentHotel._id);

      // ── Step 5: Frontend Listeners ──────────────────────────────────
      onRoomBooked((data) => {
       
        setRoomsAvailable(data.roomsAvailable);
        toast.success(data.message);
      });

      onRoomCancelled((data) => {
        setRoomsAvailable(data.roomsAvailable);
        toast.info(data.message);
      });
    } else {
      console.warn('[HotelDetail] ⚠️  currentHotel._id not available yet — socket join deferred');
    }

    // ── Step 8: Cleanup ─────────────────────────────────────────────────
    return () => {
      if (currentHotel?._id) {
        
        leaveHotel(currentHotel._id);
        offRoomBooked();
        offRoomCancelled(); // ✅ BUG FIX: was missing
        
        console.groupEnd();
      }
    };
  }, [currentHotel?._id]);

  // ── Step 6: Seed local state from Redux on initial load ────────────────────
  useEffect(() => {
    if (currentHotel?.roomsAvailable !== undefined) {
      console.log(
        '[HotelDetail] STEP 6 — Seeding roomsAvailable from Redux:',
        currentHotel.roomsAvailable,
        '(initial load only — real-time updates come from socket)'
      );
      setRoomsAvailable(currentHotel.roomsAvailable);
    }
  }, [currentHotel?.roomsAvailable]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (!currentHotel) {
    return (
      <div className="container py-24 text-center">
        <p className="text-xl text-gray-500 mb-3">Hotel not found</p>
        <Link
          to="/hotels"
          className="text-blue-600 font-semibold hover:underline underline-offset-4"
        >
          Back to Hotels
        </Link>
      </div>
    );
  }

  const hotel = currentHotel;
  const images = hotel.images || [];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
      <div className="py-6 md:py-10">
        {/* Back link */}
        <Link
          to="/hotels"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-slate-600">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.7 15.7a1 1 0 01-1.4 0l-5-5a1 1 0 010-1.4l5-5a1 1 0 111.4 1.4L8.42 10l4.3 4.3a1 1 0 010 1.4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          Back to Hotels
        </Link>

        {/* Hotel name card */}
        <div className="rounded-3xl bg-white p-6 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.35)] border border-slate-200 mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-slate-950 leading-tight">
            {hotel.name}
          </h1>
          {hotel.tagline && (
            <p className="mt-3 text-lg text-slate-500 max-w-2xl">
              {hotel.tagline}
            </p>
          )}
          {hotel.city && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                <LocationIcon className="h-4 w-4 text-sky-600" />
                {hotel.city}
              </span>
            </div>
          )}
        </div>

        {/* Gallery — main image + thumbnail strip only, NO aside here */}
        {images.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group relative w-full overflow-hidden rounded-3xl bg-slate-200 h-72 sm:h-96 lg:h-[480px] block"
            >
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={hotel.name}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-slate-400">
                  No Image
                </span>
              )}
            </button>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? "border-blue-500"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Lightbox */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-5 right-5 text-white/80 hover:text-white text-3xl leading-none"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={images[selectedImage]}
              alt={hotel.name}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* ── Content + Sticky Sidebar ── */}
        {/* items-start is the critical prop — without it the aside stretches to row height and sticky breaks */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.75fr_0.95fr] items-start">
          {/* LEFT: main content */}
          <div className="space-y-8">
            {hotel.description && (
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-3xl font-semibold text-slate-950 mb-4">
                  About this stay
                </h2>
                <p className="text-slate-600 leading-8 whitespace-pre-line">
                  {hotel.description}
                </p>
              </section>
            )}

            {hotel.address && (
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <LocationIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950 mb-2">
                      Location
                    </h2>
                    <p className="text-slate-600 leading-7">{hotel.address}</p>
                  </div>
                </div>
              </section>
            )}

            {hotel.amenities?.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-950 mb-5">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                        <AmenityIcon className="h-4 w-4" />
                      </span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    Availability
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Real-time room availability for this property.
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${roomsAvailable > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${roomsAvailable > 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  {roomsAvailable > 0
                    ? `${roomsAvailable} rooms available`
                    : "No rooms available"}
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-semibold text-slate-950">
                    Reviews
                  </h2>
                  {hotel.reviews?.length > 0 && (
                    <p className="mt-1 text-slate-500">
                      {hotel.reviews.length} guest review
                      {hotel.reviews.length > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>

              {hotel.reviews?.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {hotel.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {review.userName}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <StarRating value={review.rating} />
                          <span className="text-sm font-semibold">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                      <p className="mt-4 text-slate-600 leading-7">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm mb-8">
                  No reviews yet
                </div>
              )}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <ReviewForm hotelId={id} />
              </div>
            </section>
          </div>

          {/* RIGHT: sticky booking sidebar — moved out of the gallery, lives here now */}
          <aside className="sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain space-y-5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.08)]">
              {/* Price & Rating */}
              <div className="flex items-end justify-between gap-4 pb-5 border-b border-gray-100">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Price per night
                  </p>
                  <p className="mt-1.5 text-3xl font-extrabold text-gray-900 tracking-tight">
                    ₹{Number(hotel.pricePerNight).toLocaleString("en-IN")}
                  </p>
                </div>
                {hotel.rating != null && (
                  <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 border border-amber-200/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-amber-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{hotel.rating} / 5</span>
                  </div>
                )}
              </div>

              {/* Info blocks */}
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-gray-50/70 border border-gray-100/50 p-4 flex gap-3 items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Location
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-gray-700 leading-relaxed">
                      {hotel.address || "Address not provided"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50/70 border border-gray-100/50 p-4 flex gap-3 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-400 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 4.5v15m6-15v15m-10.5-3h15m-15-6h15m-15-6h15"
                    />
                  </svg>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Rooms Available
                    </p>
                    <p
                      className={`mt-0.5 text-sm font-bold ${roomsAvailable > 0 ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {roomsAvailable ?? 0} rooms remaining
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5">
                {token ? (
                  <Link
                    to={`/book-hotel/${id}`}
                    className={`inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/10 transition-all duration-200 hover:bg-blue-700 active:scale-[0.99] ${
                      roomsAvailable > 0
                        ? ""
                        : "cursor-not-allowed opacity-50 pointer-events-none"
                    }`}
                  >
                    {roomsAvailable > 0 ? "Book Now" : "Sold Out"}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/10 transition-all duration-200 hover:bg-blue-700 active:scale-[0.99]"
                  >
                    Login to Book
                  </Link>
                )}
              </div>

              <p className="mt-3 text-center text-[11px] font-medium text-gray-400">
                You won't be charged yet
              </p>

              {/* Secure badge */}
              <div className="mt-5 rounded-2xl bg-slate-50/50 border border-slate-100 p-4 flex gap-3 items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                <div className="text-xs">
                  <p className="font-bold text-gray-800">Secure booking</p>
                  <p className="mt-0.5 text-gray-500 leading-normal">
                    Your details are protected and encrypted securely.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
