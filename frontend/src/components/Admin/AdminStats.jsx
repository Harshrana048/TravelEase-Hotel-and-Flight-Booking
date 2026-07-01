import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminStats } from "../../redux/slices/adminSlice";

function AdminStats() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminStats());
  }, [dispatch]);
  const StatCard = ({ icon, label, value, color }) => (
    <div className={`${color} p-6 rounded shadow`}>
      <p className="text-4xl mb-2">{icon}</p>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Statistics</h2>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats.users}
          color="bg-blue-50"
        />
        <StatCard
          icon="🏨"
          label="Total Hotels"
          value={stats.hotels}
          color="bg-green-50"
        />
        <StatCard
          icon="✈"
          label="Total Flights"
          value={stats.flights}
          color="bg-purple-50"
        />
        <StatCard
          icon="📅"
          label="Total Bookings"
          value={stats.totalBookings}
          color="bg-yellow-50"
        />
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="🏨"
          label="Hotel Bookings"
          value={stats.hotelBookings}
          color="bg-green-50"
        />
        <StatCard
          icon="✈"
          label="Flight Bookings"
          value={stats.flightBookings}
          color="bg-purple-50"
        />
        <StatCard
          icon="📊"
          label="Avg Booking Value"
          value={`₹${Math.round(stats.averageBookingValue)}`}
          color="bg-orange-50"
        />
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-primary to-blue-700 text-white p-6 rounded shadow">
          <p className="text-gray-200 text-sm mb-2">Total Revenue</p>
          <p className="text-4xl font-bold">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-linear-to-br from-green-500 to-green-700 text-white p-6 rounded shadow">
          <p className="text-gray-200 text-sm mb-2">Hotel Revenue</p>
          <p className="text-4xl font-bold">
            ₹{stats.hotelRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-linear-to-br from-purple-500 to-purple-700 text-white p-6 rounded shadow">
          <p className="text-gray-200 text-sm mb-2">Flight Revenue</p>
          <p className="text-4xl font-bold">
            ₹{stats.flightRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
