import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CancelBookingModal from "./CancelBookingModal";
import PaymentStatusBadge from "./PaymentStatusBadge";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getBookingName,
  getBookingRoute,
  getBookingTypeLabel,
  getTravelDate,
  prettyStatus,
} from "./dashboardHelpers";
import { createPaymentOrder, verifyPayment } from "../../redux/slices/bookingSlice";
import api from "../../services/api";

const downloadPDF = async (bookingId, bookingType) => {
  const toastId = toast.loading("Generating PDF...");

  try {
    const type = bookingType === "hotel" ? "HotelBooking" : "FlightBooking";

    const response = await api.get(
      `/bookings/download-ticket/${bookingId}?type=${type}`,
      {
        responseType: "blob",
      },
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}-${bookingId}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.dismiss(toastId);
    toast.success("Ticket downloaded successfully");
  } catch (err) {
    toast.dismiss(toastId);
    toast.error(err.response?.data?.message || "Failed to download ticket");
  }
};

function BookingVisual({ booking, type }) {
  const image = type === "hotel" ? booking.hotelId?.images?.[0] : null;

  if (image) {
    return (
      <img
        src={image}
        alt={getBookingName(booking, type)}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-600">
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    </div>
  );
}

export default function BookingCard({
  booking,
  type,
  compact = false,
  showPaymentAction = true,
}) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(!compact);
  const [paying, setPaying] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isHotel = type === "hotel";
  const bookingType = isHotel ? "HotelBooking" : "FlightBooking";
  const seats = Array.isArray(booking.seatNumbers)
    ? booking.seatNumbers.join(", ")
    : booking.seatNumbers || "Pending";

  const handleCompletePayment = async () => {
    if (paying) return;
    setPaying(true);
    try {
      const paymentResult = await dispatch(
        createPaymentOrder({
          bookingId: booking._id,
          bookingType,
        }),
      ).unwrap();

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onerror = () => {
        setPaying(false);
        toast.error("Failed to load payment gateway");
      };

      script.onload = () => {
        const options = {
          key: paymentResult.key,
          amount: paymentResult.amount * 100,
          currency: "INR",
          name: "TravelEase",
          description: `${getBookingTypeLabel(type)} Booking - ${getBookingName(
            booking,
            type,
          )}`,
          order_id: paymentResult.orderId,
          handler: async (response) => {
            try {
              await dispatch(
                verifyPayment({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  bookingId: booking._id,
                  bookingType,
                }),
              ).unwrap();

              toast.success("Payment verified successfully");
              navigate("/payment-success", {
                state: { bookingId: booking._id, bookingType },
              });
            } catch (err) {
              const errorMsg =
                typeof err === "string"
                  ? err
                  : err?.message || "Payment verification failed";
              toast.error(errorMsg);
              navigate("/payment-failure", { state: { error: errorMsg } });
            } finally {
              setPaying(false);
            }
          },
          modal: {
            ondismiss: () => setPaying(false),
          },
          prefill: {
            email: user?.email,
            contact: isHotel
              ? booking.contactPhone
              : booking.passengers?.[0]?.phone || user?.phone || "",
          },
          theme: { color: "#2563eb" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
    } catch (err) {
      const errorMsg =
        typeof err === "string" ? err : err?.message || "Failed to start payment";
      toast.error(errorMsg);
      setPaying(false);
    }
  };

  return (
    <>
      <article
        className={`rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/70 ${
          compact ? "p-4" : "p-5"
        }`}
      >
        <div className="flex flex-col gap-5 sm:flex-row">
          <div
            className={`overflow-hidden rounded-2xl border border-slate-100 ${
              compact ? "h-20 sm:w-24" : "h-36 sm:h-auto sm:w-44"
            } shrink-0`}
          >
            <BookingVisual booking={booking} type={type} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  {getBookingTypeLabel(type)} Booking
                </p>
                <h3 className="mt-1 truncate text-lg font-black text-slate-950">
                  {getBookingName(booking, type)}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {getBookingRoute(booking, type)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                
                <PaymentStatusBadge
                  status={booking.bookingStatus}
                  label={prettyStatus(booking.bookingStatus)}
                />
                <PaymentStatusBadge status={booking.paymentStatus} />
              </div>
            </div>

            {detailsOpen && (
              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Booking Date
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Travel Date
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {isHotel
                      ? `${formatDate(booking.checkInDate)} - ${formatDate(
                          booking.checkOutDate,
                        )}`
                      : formatDateTime(getTravelDate(booking, type))}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Details
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {isHotel
                      ? `${booking.roomsBooked || 0} room${
                          booking.roomsBooked === 1 ? "" : "s"
                        }, ${booking.guests?.length || booking.guestCount || 0} guest${
                          (booking.guests?.length || booking.guestCount) === 1
                            ? ""
                            : "s"
                        }`
                      : `${booking.passengers?.length || booking.passengerCount || 0} passenger${
                          (booking.passengers?.length || booking.passengerCount) === 1
                            ? ""
                            : "s"
                        }, Seats ${seats}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Amount
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-950">
                    {formatCurrency(booking.totalPrice)}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Booking ID
                </p>
                <p className="mt-1 truncate font-mono text-xs text-slate-500">
                  {booking._id}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setDetailsOpen((value) => !value)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  {detailsOpen ? "Hide Details" : "View Details"}
                </button>
                {showPaymentAction && booking.paymentStatus === "pending" && (
                  <button
                    type="button"
                    onClick={handleCompletePayment}
                    disabled={paying}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {paying ? "Opening Payment..." : "Complete Payment"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => downloadPDF(booking._id, type)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Download PDF
                </button>
                {booking.bookingStatus === "confirmed" && (
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="rounded-2xl bg-rose-50 px-5 py-3 text-sm font-black text-rose-600 transition hover:bg-rose-600 hover:text-white"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {showCancelModal && (
        <CancelBookingModal
          booking={booking}
          bookingType={type}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </>
  );
}
