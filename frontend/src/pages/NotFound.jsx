import { Link } from "react-router-dom";

function CompassIcon({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.5 9.5l-2 5-3 1.5 2-5z"
      />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <CompassIcon className="h-10 w-10" />
        </div>

        <p className="text-8xl font-black tracking-tight text-primary leading-none">
          404
        </p>

        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
          Looks like you've wandered off the map
        </h1>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been
          moved, renamed, or never existed in the first place.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-black bg-white border border-gray-200 hover:border-primary/30 hover:text-primary transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/hotels"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-gray-700 bg-white border border-gray-200 hover:border-primary/30 hover:text-primary transition-colors"
          >
            Browse Hotels
          </Link>
           <Link
            to="/flights"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-gray-700 bg-white border border-gray-200 hover:border-primary/30 hover:text-primary transition-colors"
          >
            Browse Flights
          </Link>
        </div>

        <p className="mt-10 text-sm text-gray-400">
          Need help?{" "}
          <Link to="/contact" className="text-primary font-semibold hover:underline underline-offset-4">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}