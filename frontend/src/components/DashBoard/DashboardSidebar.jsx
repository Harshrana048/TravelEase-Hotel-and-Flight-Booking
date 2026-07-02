import { useSelector } from "react-redux";
import { getInitials } from "./dashboardHelpers";

const items = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "profile", label: "Profile", icon: "user" },
  { id: "bookings", label: "My Bookings", icon: "ticket" },
  { id: "payments", label: "Payments", icon: "card" },

];

function Icon({ type }) {
  const common = "h-5 w-5";
  const paths = {
    grid: "M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z",
    user: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
    ticket:
      "M4 7a2 2 0 012-2h12a2 2 0 012 2v2a3 3 0 000 6v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a3 3 0 000-6V7z",
    card: "M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 3h18",
    gear: "M12 8a4 4 0 100 8 4 4 0 000-8zm8.5 4a8.5 8.5 0 01-.2 1.8l2 1.5-2 3.5-2.4-1a8.8 8.8 0 01-3.1 1.8l-.4 2.6h-4l-.4-2.6a8.8 8.8 0 01-3.1-1.8l-2.4 1-2-3.5 2-1.5A8.5 8.5 0 013.5 12c0-.6.1-1.2.2-1.8l-2-1.5 2-3.5 2.4 1A8.8 8.8 0 019.2 4.4l.4-2.6h4l.4 2.6a8.8 8.8 0 013.1 1.8l2.4-1 2 3.5-2 1.5c.1.6.2 1.2.2 1.8z",
    logout: "M15 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2v-3m-4-4h10m0 0l-3-3m3 3l-3 3",
  };

  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill={type === "grid" || type === "ticket" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[type]} />
    </svg>
  );
}

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  onLogout,
  open,
  onClose,
}) {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/30 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white px-5 py-6 shadow-2xl shadow-slate-200 transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
          
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
              aria-label="Close dashboard menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-950">{user?.name || "Traveler"}</p>
                <p className="truncate text-sm font-medium text-blue-600">
                  {user?.email || "Premium Explorer"}
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {items.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Icon type={item.icon} />
                  {item.label}
                </button>
              );
            })}
          </nav>

         
        </div>
      </aside>
    </>
  );
}
