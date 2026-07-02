import { useState } from "react";


function AirlineAvatar({ name = "" }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold shrink-0">
      {initials}
    </div>
  );
}
const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const calcDuration = (dep, arr) => {
  const diff = new Date(arr) - new Date(dep);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
};


function ReviewModal({ flight, formData, totalPrice, onBack, onConfirm, loading }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Review Your Booking</h2>
            <p className="text-sm text-slate-500 mt-0.5">Confirm details before payment</p>
          </div>
          <button onClick={onBack} className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Flight info */}
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">Flight Details</p>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <AirlineAvatar name={flight.airline} />
                <div>
                  <p className="font-bold text-slate-900">{flight.airline}</p>
                  <p className="text-sm text-slate-500">{flight.flightNumber} · {flight.class}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-center">
                <div>
                  <p className="text-xl font-extrabold text-slate-900">{flight.source}</p>
                  <p className="text-sm text-slate-500">{formatTime(flight.departureTime)}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xs text-slate-400">{calcDuration(flight.departureTime, flight.arrivalTime)}</p>
                  <div className="flex items-center gap-1">
                    <div className="h-px w-8 bg-slate-300" />
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                    <div className="h-px w-8 bg-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400">{formatDate(flight.departureTime)}</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900">{flight.destination}</p>
                  <p className="text-sm text-slate-500">{formatTime(flight.arrivalTime)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Passengers */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Passengers ({formData.passengers.length})</p>
            <div className="space-y-2">
              {formData.passengers.map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.phone} · Age {p.age}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fare summary */}
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Fare Breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Base fare × {formData.passengers.length}</span>
                <span className="font-semibold">₹{(flight.price * formData.passengers.length).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Fees</span>
                <span className="font-semibold">₹0</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Amount</span>
                <span className="text-xl font-extrabold text-blue-600">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* T&C */}
          <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600 leading-relaxed">
              I agree to the{" "}
              <span className="text-blue-600 font-semibold">Terms & Conditions</span> and{" "}
              <span className="text-blue-600 font-semibold">Privacy Policy</span>.
              I confirm all passenger details match the government-issued IDs.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-slate-100">
          <button
            onClick={onBack}
            className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            ← Edit Details
          </button>
          <button
            onClick={onConfirm}
            disabled={!agreed || loading}
            className="flex-1 rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {loading ? "Processing..." : "Proceed to Payment →"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ReviewModal;