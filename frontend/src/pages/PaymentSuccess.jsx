import { useLocation, Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const location = useLocation();
  const state = location.state || {};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 text-center">

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-green-50 border-8 border-green-100 flex items-center justify-center">
            <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="mt-3 text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
          Your payment has been received and processed. Check your email for the itinerary.
        </p>

        {/* IDs */}
        {state.bookingId && (
          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Booking ID
              </p>
              <p className="font-mono font-bold text-slate-800 text-sm truncate">
                {state.bookingId}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Booking Type
              </p>
              <p className="font-mono font-bold text-slate-800 text-sm truncate">
                {state.bookingType || '—'}
              </p>
            </div>
          </div>
        )}

        {/* Status pill */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2 text-sm font-semibold text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Fully Paid
        </div>

        {/* CTAs */}
        <div className="mt-7 space-y-3">
          <Link
            to="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.99]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-[0.99]"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer help */}
        <p className="mt-7 text-xs text-slate-400">
          Need help?{' '}
          <Link to="/contact" className="font-semibold text-blue-600 hover:underline">
            Contact Support
          </Link>{' '}
          or visit our{' '}
          <Link to="/help" className="font-semibold text-blue-600 hover:underline">
            Help Center
          </Link>
          .
        </p>
      </div>
    </div>
  );
}