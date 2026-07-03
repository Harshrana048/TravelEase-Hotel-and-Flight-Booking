import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../../redux/slices/adminSlice";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', cls: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' },
  pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-500 ring-1 ring-red-200' },
};

const TYPE_CONFIG = {
  hotel:  { label: 'Hotel',  cls: 'bg-teal-50 text-teal-600', icon: '🏨' },
  flight: { label: 'Flight', cls: 'bg-indigo-50 text-indigo-600', icon: '✈' },
};

function BookingManagement() {
  const dispatch = useDispatch();
  const { allBookings, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  const filtered = allBookings.filter((b) => {
    const matchesSearch =
      b._id?.toLowerCase().includes(search.toLowerCase()) ||
      b.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.hotelId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.flightId?.source?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || b.bookingStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSkeleton rows={6} cols={7} />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Bookings</h2>
          <p className="text-sm text-slate-400">{allBookings.length} total bookings</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-48 shadow-sm">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No bookings found"
            subtitle={search || filterStatus !== 'all' ? 'Try adjusting your filters.' : 'No bookings have been made yet.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Booking ID</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Details</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((booking) => {
                  const isHotel = !!booking.hotelId;
                  const typeKey = isHotel ? 'hotel' : 'flight';
                  const typeConfig = TYPE_CONFIG[typeKey];
                  const statusConfig = STATUS_CONFIG[booking.bookingStatus] || {
                    label: booking.bookingStatus,
                    cls: 'bg-slate-100 text-slate-600',
                  };

                  return (
                    <tr key={booking._id} className="hover:bg-slate-50/70 transition-colors duration-150">
                      {/* Booking ID */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          #{booking._id.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-white">
                              {booking.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-700">
                            {booking.userId?.name || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${typeConfig.cls}`}>
                          <span>{typeConfig.icon}</span>
                          {typeConfig.label}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {isHotel
                            ? booking.hotelId?.name
                            : `${booking.flightId?.source} → ${booking.flightId?.destination}`}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-800">
                          ₹{Number(booking.totalPrice).toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            booking.bookingStatus === 'confirmed' ? 'bg-emerald-500' :
                            booking.bookingStatus === 'pending' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`} />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500">
                          {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingManagement;
