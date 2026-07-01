import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ReviewForm } from "../components/index";
import { getHotelById } from "../redux/slices/hotelSlice";

/* ---------- small presentational helpers (UI only, no logic/data changes) ---------- */

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
  const [lightboxOpen, setLightboxOpen] = useState(false); // UI-only, no data/logic change

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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-primary"></div>
      </div>
    );
  }

  if (!currentHotel) {
    return (
      <div className="container py-24 text-center">
        <p className="text-xl text-gray-500 mb-3">Hotel not found</p>
        <Link
          to="/hotels"
          className="text-primary font-semibold hover:underline underline-offset-4"
        >
          Back to Hotels
        </Link>
      </div>
    );
  }

  const hotel = currentHotel;
  const images = hotel.images || [];
  // Up to 4 side thumbnails; anything beyond that is reachable via "+N more" / the strip below
  const thumbnails = images.slice(1, 5);
  const extraCount = images.length - 5;

  return (
    <div className="max-w-360 mx-auto px-8 py-8">
      <div className="container py-6 md:py-10">
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

        <div className="rounded-4xl bg-white p-6 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.35)] border border-slate-200">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div>
              <div className="flex flex-col gap-4 lg:gap-6">
                <div>
                  <h1 className="font-serif text-4xl md:text-5xl font-semibold text-slate-950 leading-tight">
                    {hotel.name}
                  </h1>
                  {hotel.tagline && (
                    <p className="mt-3 text-lg text-slate-500 max-w-2xl">
                      {hotel.tagline}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  {hotel.city && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                      <LocationIcon className="h-4 w-4 text-sky-600" />
                      {hotel.city}
                    </span>
                  )}
                  {hotel.rating != null && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                      <StarRating value={hotel.rating} />
                      <span className="font-semibold text-slate-700">
                        {hotel.rating}/5
                      </span>
                    </span>
                  )}
                  {hotel.roomsAvailable >= 0 && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      {hotel.roomsAvailable} rooms available
                    </span>
                  )}
                </div>
              </div>
            </div>

            
          </div>
        </div>

        {/* ---------- Gallery ---------- */}
        {images.length > 0 && (
          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:h-120">
            {/* Main image — always full height, always the largest element.
                Width adapts depending on whether there are side thumbnails to show. */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className={`group relative overflow-hidden rounded-4xl bg-slate-200 h-72 sm:h-96 lg:h-full ${
                thumbnails.length > 0 ? "lg:w-2/3" : "lg:w-full"
              }`}
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

            {/* Side thumbnails — a flex column so 1, 2, 3 or 4 thumbnails always share the
                full column height evenly, with no leftover empty space. */}
            
                      
          </div>
        )}

        {/* Thumbnail strip (keeps original select-image functionality, all images) */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mt-4 mb-10">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === idx
                    ? "border-primary"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* ---------- Lightbox ---------- */}
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

        {/* ---------- Content ---------- */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.75fr_0.95fr]">
          <div className="space-y-10">
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

            {hotel.amenities && hotel.amenities.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-950 mb-5">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
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
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    hotel.roomsAvailable > 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${hotel.roomsAvailable > 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  {hotel.roomsAvailable > 0
                    ? `${hotel.roomsAvailable} rooms available`
                    : "No rooms available"}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-semibold text-slate-950">
                    Reviews
                  </h2>
                  {hotel.reviews && hotel.reviews.length > 0 && (
                    <p className="mt-1 text-slate-500">
                      {hotel.reviews.length} guest review
                      {hotel.reviews.length > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>

              {hotel.reviews && hotel.reviews.length > 0 ? (
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
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                  No reviews yet
                </div>
              )}

              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                <ReviewForm hotelId={id} />
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-slate-500">
                    Price per night
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">
                    ₹{hotel.pricePerNight}
                  </p>
                </div>
                {hotel.rating != null && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    <StarRating value={hotel.rating} />
                    <span>{hotel.rating}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Location</p>
                {hotel.address && (
                  <p className="mt-2 text-slate-700">{hotel.address}</p>
                )}
              </div>

              <div className="mt-4 rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Rooms available</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {hotel.roomsAvailable ?? 0}
                </p>
              </div>

              <div className="mt-6">
                {token ? (
                  <Link
                    to={`/book-hotel/${id}`}
                    className={`inline-flex w-full items-center justify-center rounded-3xl bg-sky-700 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-700/20 transition hover:bg-sky-800 ${
                      hotel.roomsAvailable > 0
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-70"
                    }`}
                  >
                    {hotel.roomsAvailable > 0 ? "Book Now" : "Unavailable"}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-700 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-700/20 transition hover:bg-sky-800"
                  >
                    Login to Book
                  </Link>
                )}
              </div>

              <p className="mt-3 text-center text-sm text-slate-500">
                You won't be charged yet
              </p>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Secure booking</p>
                <p className="mt-1">
                  Your details are protected and never shared.
                </p>
              </div>
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-100 text-sky-700">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.9 3.9 6.7-6.7a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-950">
                    Best price guarantee
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    We match prices if you find a lower rate.
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