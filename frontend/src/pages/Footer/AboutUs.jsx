export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-10 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.8)] backdrop-blur-xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
              About TravelEase
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Built for modern travelers who expect premium journeys.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              TravelEase is a curated travel booking experience that brings
              luxury hospitality, seamless flight reservations, and tailored
              itineraries together in one elegant platform.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">Our mission</h2>
              <p className="mt-3 text-slate-300">
                Inspire every traveler with thoughtfully curated stays, flights,
                and seamless booking journeys.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">
                What we value
              </h2>
              <p className="mt-3 text-slate-300">
                Elegant design, trust, personalization, and a hospitality-first
                experience for every journey.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">
                Why TravelEase
              </h2>
              <p className="mt-3 text-slate-300">
                We combine curated options with intuitive booking tools to make
                luxury travel easier than ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
