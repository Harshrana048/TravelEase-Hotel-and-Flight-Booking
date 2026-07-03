function LoadingSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="h-5 w-32 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-9 w-28 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      {/* Table header */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className={`h-4 bg-slate-200 rounded animate-pulse ${i === 0 ? 'w-24' : 'flex-1'}`} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="px-6 py-4 border-b border-slate-50 flex gap-6 items-center"
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={`h-4 bg-slate-100 rounded animate-pulse ${
                colIdx === 0 ? 'w-32' : 'flex-1'
              }`}
              style={{ animationDelay: `${(rowIdx * cols + colIdx) * 40}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="w-11 h-11 bg-slate-200 rounded-xl animate-pulse mb-4" />
            <div className="h-7 w-20 bg-slate-200 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
