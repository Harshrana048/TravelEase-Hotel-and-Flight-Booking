export default function LegalDisclaimer() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-10 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.8)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
            Legal Disclaimer
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            TravelEase provides information as-is.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            The information on this site is for reference only and subject to
            change based on provider policies.
          </p>

          <div className="mt-10 space-y-8 text-slate-300">
            <div>
              <h2 className="text-xl font-semibold text-white">Accuracy</h2>
              <p className="mt-3">
                We strive for accuracy but cannot guarantee every detail remains
                up to date.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Third-party content
              </h2>
              <p className="mt-3">
                TravelEase is not responsible for third-party travel provider
                terms or availability.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Usage</h2>
              <p className="mt-3">
                Use the site responsibly and review provider terms before
                booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
