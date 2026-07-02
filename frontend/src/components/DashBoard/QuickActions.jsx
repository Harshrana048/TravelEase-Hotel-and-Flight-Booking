const actions = [
  {
    label: "Book Hotel",
    to: "/hotels",
    icon: "M4 21V5a2 2 0 012-2h9a2 2 0 012 2v16M8 7h1m4 0h1M8 11h1m4 0h1M3 21h18",
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Book Flight",
    to: "/flights",
    icon: "M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
    tone: "bg-blue-50 text-blue-600",
  },
  {
    label: "View My Bookings",
    to: "bookings",
    tab: true,
    icon: "M4 7a2 2 0 012-2h12a2 2 0 012 2v2a3 3 0 000 6v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a3 3 0 000-6V7z",
    tone: "bg-violet-50 text-violet-600",
  },
  {
    label: "Manage Profile",
    to: "profile",
    tab: true,
    icon: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
    tone: "bg-amber-50 text-amber-600",
  },
];

export default function QuickActions({ onNavigate, onTabChange }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">Quick Actions</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() =>
              action.tab ? onTabChange(action.to) : onNavigate(action.to)
            }
            className="group rounded-3xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/70"
          >
            <span
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${action.tone} transition group-hover:scale-105`}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
              </svg>
            </span>
            <span className="mt-3 block text-sm font-black text-slate-800">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
