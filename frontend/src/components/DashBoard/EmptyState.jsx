import { Link } from "react-router-dom";

export default function EmptyState({
  title = "No bookings yet.",
  subtitle = "Start with a hotel or flight and your travel plans will appear here.",
  action = "Explore Hotels",
  to = "/hotels",
}) {
  return (
    <div className="rounded-3xl border border-dashed border-blue-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-4xl bg-blue-50 text-blue-600">
        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5l8.5-8.5a2 2 0 012.8 0L21 14.7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h.01M17 11h.01" />
        </svg>
      </div>
      <h3 className="mt-5 text-2xl font-black text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{subtitle}</p>
      <Link
        to={to}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
      >
        {action}
      </Link>
    </div>
  );
}
