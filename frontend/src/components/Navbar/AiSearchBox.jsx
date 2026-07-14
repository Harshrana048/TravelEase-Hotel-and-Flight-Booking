import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { searchHotelsWithAI, searchFlightsWithAI } from '../../services/ai';

export default function AISearchBox() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searchType, setSearchType] = useState('hotels');

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);

    try {
      let data;
      if (searchType === 'hotels') {
        data = await searchHotelsWithAI(query);
      } else {
        data = await searchFlightsWithAI(query);
      }

      setResults(data);
      toast.success(`Found ${data.count || 0} results!`);
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* 1. Main Dashboard AI Search Panel wrapper */}
      <div className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm text-2xl">🤖</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">AI Smart Search</h2>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          {/* Segmented Control Tabs instead of plain raw radio inputs */}
          <div className="inline-flex bg-black/10 backdrop-blur-md p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setSearchType('hotels')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                searchType === 'hotels' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:text-white'
              }`}
            >
              🏨 Hotels
            </button>
            <button
              type="button"
              onClick={() => setSearchType('flights')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                searchType === 'flights' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:text-white'
              }`}
            >
              ✈️ Flights
            </button>
          </div>

          {/* Integrated Bar Interface */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  searchType === 'hotels'
                    ? 'e.g., "5-star luxury resorts in Goa with private pool under ₹40000"'
                    : 'e.g., "Business class flight from Mumbai to Delhi on Dec 20"'
                }
                className="w-full pl-4 pr-4 py-4 rounded-xl bg-white text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-blue-700 hover:bg-slate-50 font-extrabold text-base px-8 py-4 rounded-xl transition-all shadow active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 min-w-35"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>

          <p className="text-blue-100 text-xs sm:text-sm flex items-center gap-1.5 opacity-90">
            <span>💡</span>
            <span className="italic">Try typing naturally: "cheap flight to Delhi next week" or "hotels with free wifi"</span>
          </p>
        </form>
      </div>

      {/* 2. Dynamic Results Display Frame */}
      {results && results.count > 0 && (
        <div className="animate-fadeIn">
          <div className="border-b border-slate-100 pb-4 mb-8 flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Found {results.count} Match{results.count > 1 ? 'es' : ''}
            </h3>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
              {searchType}
            </span>
          </div>

          {searchType === 'hotels' ? (
            /* Hotel Grid Presentation Card UI */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.hotels.map((hotel) => (
                <div key={hotel._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
                  <div className="relative overflow-hidden aspect-video bg-slate-100">
                    <img
                      src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60'}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-xs font-bold text-amber-600 shadow-sm flex items-center gap-0.5">
                      ⭐ {hotel.rating || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1 block">
                      {hotel.city}
                    </span>
                    <h4 className="text-base font-bold text-slate-800 tracking-tight mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {hotel.name}
                    </h4>
                    
                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Price / Night</span>
                        <span className="text-xl font-black text-slate-900">₹{hotel.pricePerNight}</span>
                      </div>
                      <Link
                        to={`/hotels/${hotel._id}`}
                        className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Flight List Presentation Card UI */
            <div className="space-y-4">
              {results.flights.map((flight) => (
                <div key={flight._id} className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-black text-xs border border-blue-100/50">
                      ✈️
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-blue-600 transition-colors">
                          {flight.flightNumber}
                        </h4>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                          {flight.airline}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                        <span className="text-slate-700">{flight.source}</span>
                        <span className="text-slate-300">➔</span>
                        <span className="text-slate-700">{flight.destination}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                    <div className="sm:text-right">
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">One-way Fare</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">₹{flight.price}</span>
                    </div>
                    <Link
                      to={`/flights/${flight._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-5 py-3 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                    >
                      Book Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Empty State Presentation Interface */}
      {results && results.count === 0 && (
        <div className="text-center py-16 px-4 max-w-sm mx-auto animate-fadeIn">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-200/40">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-1">No Results Found</h4>
          <p className="text-sm text-slate-500 leading-normal">
            Gemini couldn't match entries with your current syntax. Try altering budget structures or locations.
          </p>
        </div>
      )}
    </div>
  );
}