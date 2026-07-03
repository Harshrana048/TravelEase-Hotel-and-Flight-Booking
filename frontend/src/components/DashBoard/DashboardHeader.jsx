import { getInitials } from "./dashboardHelpers";

export default function DashboardHeader({ user, onMenuClick }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between py-10">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="mt-1 rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm lg:hidden"
          aria-label="Open dashboard menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            User Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Welcome back, {user?.name || "Traveler"}
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Manage your bookings, payments and travel plans.
          </p>
        </div>
      </div>

     {/* Automatically hides the entire component if dateStr is null, undefined, or an empty string */}
{dateStr && (
  <div className="flex items-center gap-3 self-end sm:self-auto">
    <div className="inline-flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-3.5 py-2 shadow-sm transition-all duration-200 hover:border-slate-200">
      
      {/* Calendar Icon */}
      <div className="p-1 bg-slate-50 text-slate-400 rounded-lg">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <span className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none mb-0.5">
          Date 
        </span>
        <p className="text-xs font-bold text-slate-700 tracking-tight leading-tight">
          {dateStr}
        </p>
      </div>

    </div>
  </div>
)}
    </header>
  );
}
