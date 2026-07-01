export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-10 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.8)] backdrop-blur-xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              We’re here to help you travel better.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Reach out to the TravelEase team for support, partnership
              inquiries, or general questions about your booking experience.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">
                Customer support
              </h2>
              <p className="mt-3 text-slate-300">
                Email us at support@travelease.com or call +91-6354594431 for
                help with your reservations.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">
                Corporate inquiries
              </h2>
              <p className="mt-3 text-slate-300">
                For partnerships and media, contact our team and we’ll respond
                promptly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
