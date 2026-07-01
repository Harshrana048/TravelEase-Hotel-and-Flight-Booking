export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-10 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.8)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
            Privacy Policy
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Your trust is our top priority.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            TravelEase collects only the information necessary to deliver
            exceptional booking experiences and protect your privacy.
          </p>

          <div className="mt-10 space-y-8 text-slate-300">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Data Collection
              </h2>
              <p className="mt-3">
                We gather personal information only to complete bookings, secure
                accounts, and provide support.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Security</h2>
              <p className="mt-3">
                Your information is protected through secure handling and
                trusted practices.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Usage</h2>
              <p className="mt-3">
                We use data to personalize your experience, improve the
                platform, and keep you informed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
