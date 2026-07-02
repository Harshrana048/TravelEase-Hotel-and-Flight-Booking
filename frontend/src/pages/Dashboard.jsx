import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardSidebar from "../components/DashBoard/DashboardSidebar";
import DashboardHeader from "../components/DashBoard/DashboardHeader";
import StatsCards from "../components/DashBoard/StatsCards";
import UpcomingBookings from "../components/DashBoard/UpcomingBookings";
import RecentBookings from "../components/DashBoard/RecentBookings";
import QuickActions from "../components/DashBoard/QuickActions";
import ProfileCard from "../components/DashBoard/ProfileCard";
import MyBookings from "../components/DashBoard/MyBookings";

import { getMyBookings } from "../redux/slices/dashboardSlice";
import { logout } from "../redux/slices/authSlices";

const flattenBookings = (hotelBookings = [], flightBookings = []) => [
  ...hotelBookings.map((booking) => ({ ...booking, dashboardType: "hotel" })),
  ...flightBookings.map((booking) => ({ ...booking, dashboardType: "flight" })),
];

const getBookingTravelTime = (booking) => {
  const travelDate =
    booking.dashboardType === "hotel"
      ? booking.checkInDate
      : booking.flightId?.departureTime;

  return travelDate ? new Date(travelDate).getTime() : 0;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { hotelBookings, flightBookings, loading, error } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const allBookings = useMemo(
    () =>
      flattenBookings(hotelBookings, flightBookings).sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      ),
    [hotelBookings, flightBookings],
  );

  const upcomingBookings = useMemo(
    () =>
      allBookings
        .filter((booking) => booking.bookingStatus !== "cancelled" && booking.bookingStatus !== "pending")
        .sort((a, b) => {
          const today = new Date().setHours(0, 0, 0, 0);
          const aTime = getBookingTravelTime(a);
          const bTime = getBookingTravelTime(b);
          const aIsFuture = aTime >= today;
          const bIsFuture = bTime >= today;

          if (aIsFuture && bIsFuture) return aTime - bTime;
          if (!aIsFuture && !bIsFuture) return bTime - aTime;
          return aIsFuture ? -1 : 1;
        }),
    [allBookings],
  );

  const pendingPayments = allBookings.filter(
    (booking) => booking.paymentStatus === "pending",
  );

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const renderActiveTab = () => {
    if (loading) {
      return (
        <div className="flex min-h-105 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        </div>
      );
    }

    if (activeTab === "profile" || activeTab === "settings") {
      return <ProfileCard />;
    }

    if (activeTab === "bookings") {
      return (
        <MyBookings
          hotelBookings={hotelBookings}
          flightBookings={flightBookings}
        />
      );
    }

    if (activeTab === "payments") {
      return (
        <RecentBookings
          title="Pending Payments"
          bookings={pendingPayments}
          emptyTitle="No pending payments."
          emptyAction="View Bookings"
          emptyActionTo="/dashboard"
          showPaymentAction
        />
      );
    }

    return (
      <div className="space-y-6">
        <StatsCards
          hotelBookings={hotelBookings}
          flightBookings={flightBookings}
          upcomingCount={upcomingBookings.length}
        />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <UpcomingBookings bookings={upcomingBookings.slice(0, 4)} />
          
            <QuickActions onNavigate={navigate} onTabChange={setActiveTab} />
          </div>
          <div className="space-y-6">
            <ProfileCard compact />
            
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex w-full max-w-375">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          onLogout={handleLogout}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <section className="min-w-0 flex-1 border-l border-slate-100 bg-slate-50/70">
          <div className="px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
            <DashboardHeader
              user={user}
              onMenuClick={() => setSidebarOpen(true)}
            />
            <div className="mt-8">{renderActiveTab()}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
