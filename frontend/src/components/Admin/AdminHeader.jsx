import { useSelector } from 'react-redux';

const PAGE_TITLES = {
  stats: 'Dashboard',
  hotels: 'Hotel Management',
  flights: 'Flight Management',
  users: 'User Management',
  bookings: 'Booking Management',
};

function AdminHeader({ activeTab, onMenuOpen, collapsed, onToggleCollapse }) {
  const { user } = useSelector((state) => state.auth);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-6 py-3 flex items-center gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Desktop collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-800 truncate">
          {PAGE_TITLES[activeTab] || 'Admin Panel'}
        </h1>
        <p className="text-xs text-slate-400 hidden sm:block">{dateStr}</p>
      </div>

      
      {/* Admin avatar */}
      <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm shrink-0">
          <span className="text-sm font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </span>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-slate-700 leading-none">{user?.name || 'Admin'}</p>
          <p className="text-xs text-blue-500 mt-0.5">Admin</p>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
