import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminStats } from "../../redux/slices/adminSlice";
import StatCard from "./StatCard";
import { StatsSkeleton } from "./LoadingSkeleton";

function AdminStats() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminStats());
  }, [dispatch]);

  if (loading) {
    return <StatsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page intro */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Overview</h2>
        <p className="text-sm text-slate-400 mt-0.5">Welcome back! Here's what's happening with TravelEase.</p>
      </div>

      {/* Primary stats row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          }
          label="Total Users"
          value={stats.users?.toLocaleString()}
          gradient="bg-gradient-to-br from-blue-50 to-blue-100/50"
          iconBg="bg-blue-100"
          trend
        />
        <StatCard
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
          }
          label="Total Hotels"
          value={stats.hotels?.toLocaleString()}
          gradient="bg-gradient-to-br from-emerald-50 to-emerald-100/50"
          iconBg="bg-emerald-100"
          trend
        />
        <StatCard
          icon={
            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          }
          label="Total Flights"
          value={stats.flights?.toLocaleString()}
          gradient="bg-gradient-to-br from-violet-50 to-violet-100/50"
          iconBg="bg-violet-100"
          trend
        />
        <StatCard
          icon={
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          }
          label="Total Bookings"
          value={stats.totalBookings?.toLocaleString()}
          gradient="bg-gradient-to-br from-amber-50 to-amber-100/50"
          iconBg="bg-amber-100"
          trend
        />
      </div>

      {/* Booking breakdown row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={
            <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
          }
          label="Hotel Bookings"
          value={stats.hotelBookings?.toLocaleString()}
          gradient="bg-gradient-to-br from-teal-50 to-teal-100/50"
          iconBg="bg-teal-100"
        />
        <StatCard
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          }
          label="Flight Bookings"
          value={stats.flightBookings?.toLocaleString()}
          gradient="bg-gradient-to-br from-indigo-50 to-indigo-100/50"
          iconBg="bg-indigo-100"
        />
        <StatCard
          icon={
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          }
          label="Avg. Booking Value"
          value={`₹${Math.round(stats.averageBookingValue || 0).toLocaleString()}`}
          gradient="bg-gradient-to-br from-orange-50 to-orange-100/50"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Revenue cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Revenue</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Revenue */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-linear-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-200">
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -right-2 -top-2 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="text-blue-200 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-blue-300 text-xs mt-2">All time earnings</p>
            </div>
          </div>

          {/* Hotel Revenue */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-linear-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200">
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -right-2 -top-2 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <p className="text-emerald-200 text-sm mb-1">Hotel Revenue</p>
              <p className="text-3xl font-bold">₹{(stats.hotelRevenue || 0).toLocaleString()}</p>
              <p className="text-emerald-300 text-xs mt-2">From hotel bookings</p>
            </div>
          </div>

          {/* Flight Revenue */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-linear-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-200">
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -right-2 -top-2 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </div>
              <p className="text-violet-200 text-sm mb-1">Flight Revenue</p>
              <p className="text-3xl font-bold">₹{(stats.flightRevenue || 0).toLocaleString()}</p>
              <p className="text-violet-300 text-xs mt-2">From flight bookings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
