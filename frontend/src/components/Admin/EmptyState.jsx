function EmptyState({ title = 'No data found', subtitle = 'There is nothing to display here yet.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* SVG Illustration */}
      <div className="w-32 h-32 mb-6 text-slate-300">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#F1F5F9" />
          <rect x="60" y="70" width="80" height="10" rx="5" fill="#CBD5E1" />
          <rect x="60" y="88" width="60" height="10" rx="5" fill="#E2E8F0" />
          <rect x="60" y="106" width="70" height="10" rx="5" fill="#E2E8F0" />
          <rect x="60" y="124" width="50" height="10" rx="5" fill="#F1F5F9" />
          <circle cx="145" cy="55" r="18" fill="#BFDBFE" />
          <path d="M138 55L143 60L152 51" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6">{subtitle}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
