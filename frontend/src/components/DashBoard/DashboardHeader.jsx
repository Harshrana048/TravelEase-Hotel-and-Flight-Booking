import { getInitials } from "./dashboardHelpers";

export default function DashboardHeader({ user, onMenuClick }) {
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

      <div className="flex items-center gap-3 self-end sm:self-auto">
       
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
            {getInitials(user?.name)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-950">{user?.name || "Traveler"}</p>
            <p className="text-xs text-slate-500">{user?.role || "user"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
