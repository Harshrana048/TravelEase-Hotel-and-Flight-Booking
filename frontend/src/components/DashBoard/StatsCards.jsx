import StatCard from "./StatCard";
import { formatCurrency } from "./dashboardHelpers";

const Icon = ({ path }) => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

export default function StatsCards({
  hotelBookings = [],
  flightBookings = [],
  upcomingCount = 0,
}) {
  const allBookings = [...hotelBookings, ...flightBookings];
  const totalSpent = allBookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + (Number(booking.totalPrice) || 0), 0);

  const stats = [
    {
      label: "Total Bookings",
      value: allBookings.length,
      tone: "blue",
      icon: <Icon path="M9 5h6m-8 4h10M7 13h6m-8 8h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    },
    {
      label: "Hotel Bookings",
      value: hotelBookings.length,
      tone: "emerald",
      icon: <Icon path="M4 21V5a2 2 0 012-2h9a2 2 0 012 2v16M8 7h1m4 0h1M8 11h1m4 0h1M8 15h1m4 0h1M3 21h18" />,
    },
    {
      label: "Flight Bookings",
      value: flightBookings.length,
      tone: "violet",
      icon: <Icon path="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />,
    },
    {
      label: "Total Amount Spent",
      value: formatCurrency(totalSpent),
      tone: "amber",
      icon: <Icon path="M17 9V7a4 4 0 00-8 0v2m-2 0h12l-1 12H8L7 9zm5 4v3" />,
    },
    {
      label: "Upcoming Trips",
      value: upcomingCount,
      tone: "rose",
      icon: <Icon path="M8 7V3m8 4V3M4 11h16M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
