function StatCard({ icon, label, value, gradient, iconBg, trend }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 shadow-sm border border-white/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${gradient}`}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 bg-white" />
      <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full opacity-10 bg-white" />

      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${iconBg}`}>
          {icon}
        </div>

        <p className="text-2xl font-bold text-slate-800 mb-1">
          {value ?? '—'}
        </p>
        <p className="text-sm text-slate-500 font-medium">{label}</p>

        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ Active
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
