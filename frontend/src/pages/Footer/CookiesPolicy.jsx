export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.8)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
            Cookies Policy
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            How TravelEase uses cookies to improve your visit.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Cookies help us personalize your experience and keep the platform
            running smoothly.
          </p>

          <div className="mt-10 space-y-8 text-slate-300">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Essential cookies
              </h2>
              <p className="mt-3">
                These are required for the site to function properly.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Performance cookies
              </h2>
              <p className="mt-3">
                These help us improve the site’s speed and reliability.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Preference cookies
              </h2>
              <p className="mt-3">
                These remember your preferences and settings when you visit
                TravelEase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
