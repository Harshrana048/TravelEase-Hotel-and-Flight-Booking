export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.8)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
            Terms of Service
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Your guide to using TravelEase with confidence.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            These terms explain how TravelEase operates, what to expect, and how
            we keep your experience reliable.
          </p>

          <div className="mt-10 space-y-8 text-slate-300">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Booking terms
              </h2>
              <p className="mt-3">
                All bookings are subject to the travel provider’s policies and
                our platform terms.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Account usage
              </h2>
              <p className="mt-3">
                Users agree to keep account information accurate and to follow
                TravelEase guidelines.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Support</h2>
              <p className="mt-3">
                We provide support for booking inquiries, cancellations, and
                travel assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
