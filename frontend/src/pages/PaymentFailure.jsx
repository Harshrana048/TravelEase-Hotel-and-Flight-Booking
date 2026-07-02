import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full text-center">
        
        {/* 1. Sleek Modern Error Icon Badge Container */}
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-red-50 text-red-600 mb-8 border border-red-100/50 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        {/* 2. Header Text */}
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Payment Failed</h1>
        <p className="text-base text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
          We couldn't process your transaction. Please try again or use a different payment method.
        </p>

        {/* 3. Refined Conditional Danger Reason Box Component */}
        <div className="bg-blue-50/40 border border-blue-100/80 rounded-2xl p-5 mb-8 text-left max-w-md mx-auto flex gap-4 items-start shadow-sm">
          <div className="p-1.5 bg-blue-100/60 rounded-lg text-blue-600 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">
              Reason For Failure
            </span>
            <p className="text-sm font-semibold text-slate-600 leading-normal">
              {state.error || 'Bank declined transaction. (Error Code: TR-402)'}
            </p>
          </div>
        </div>

        {/* 4. Streamlined Dual Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
          <button
            onClick={() => navigate(-1)} // Navigates back dynamically to let them re-try
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Retry Payment
          </button>
          
          <Link to="/contact"
            
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.33.185.505.558.505.947v9.792c0 1.105-.895 2-2 2H5.25c-1.105 0-2-.895-2-2V9.458c0-.389.175-.762.505-.947l6.024-3.37a2.25 2.25 0 012.242 0l6.024 3.37z" />
            </svg>
            Contact Support
          </Link>
        </div>

        {/* 5. Minimal Navigation Footer Links */}
        <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-400">
          <Link to="/flights" className="hover:text-blue-600 transition">Browsing Flights</Link>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <Link to="/hotels" className="hover:text-blue-600 transition">Browsing Hotels</Link>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <Link to="/" className="hover:text-slate-700 transition flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Go Home
          </Link>
        </div>

      </div>
    </div>
  );
}