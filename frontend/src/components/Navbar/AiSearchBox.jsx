import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { searchHotelsWithAI, searchFlightsWithAI } from '../../services/ai';

export default function AISearchBox() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searchType, setSearchType] = useState('hotels');
  const [recentSearches, setRecentSearches] = useState([]);
  
  const textareaRef = useRef(null);

  useEffect(() => {
    // Load recent searches from local storage
    const saved = localStorage.getItem('recentAISearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const saveRecentSearch = (q) => {
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentAISearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentAISearches');
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setQuery(searchQuery);
    setLoading(true);
    setResults(null); // clear previous results
    
    saveRecentSearch(searchQuery);

    try {
      let data;
      if (searchType === 'hotels') {
        data = await searchHotelsWithAI(searchQuery);
      } else {
        data = await searchFlightsWithAI(searchQuery);
      }

      setResults(data);
      if (data.count > 0) {
        toast.success(`Found ${data.count} results!`);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const hotelPrompts = [
    "Luxury hotel in Mumbai",
    "Cheap beach resorts in Goa under ₹5000",
    "Family hotel in Jaipur",
    
  ];

  const flightPrompts = [
    "Cheap flights to Goa",
    "Business class to London",
    "Direct Mumbai to delhi flights",
    "Weekend trip to Delhi",
    "Round trip to Singapore",
    "Morning flight to Bangalore"
  ];

  const suggestedPrompts = searchType === 'hotels' ? hotelPrompts : flightPrompts;

  const renderFilters = (filters) => {
    if (!filters) return null;
    const validFilters = Object.entries(filters).filter(([key, val]) => val !== null && key !== 'checkInDate' && key !== 'checkOutDate' && key !== 'departureDate' && key !== 'returnDate');
    
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {validFilters.map(([key, val]) => (
          <span key={key} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 shadow-sm flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            {val}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Premium AI Chat Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 mb-12 relative overflow-hidden transition-all">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-linear-to-tr from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg relative">
                <span className="text-2xl animate-pulse">✨</span>
                {loading && <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">AI Travel Assistant</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Describe your perfect stay, and I'll find it.</p>
              </div>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl hidden sm:flex">
              <button onClick={() => setSearchType('hotels')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${searchType === 'hotels' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Hotels</button>
              <button onClick={() => setSearchType('flights')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${searchType === 'flights' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Flights</button>
            </div>
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchType === 'hotels' ? "E.g., A romantic luxury resort in Goa near the beach under ₹15000..." : "E.g., Business class flight to Delhi tomorrow..."}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 pr-16 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none overflow-hidden min-h-18"
              rows="1"
            />
            <button
              onClick={() => handleSearch(query)}
              disabled={loading || !query.trim()}
              className="absolute right-3 bottom-3 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-md group"
            >
              <svg className="w-5 h-5 group-hover:-rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {!results && !loading && (
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 py-1.5 flex items-center">Try:</span>
              {suggestedPrompts.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => { setQuery(prompt); handleSearch(prompt); }}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {recentSearches.length > 0 && !results && !loading && (
             <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest py-1 whitespace-nowrap">Recent:</span>
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => { setQuery(s); handleSearch(s); }} className="text-xs text-slate-500 hover:text-indigo-600 whitespace-nowrap">
                      🕒 {s}
                    </button>
                  ))}
                </div>
                <button onClick={clearRecentSearches} className="text-xs text-slate-400 hover:text-red-500 whitespace-nowrap ml-4 shrink-0">Clear</button>
             </div>
          )}

          {/* AI Thinking Animation */}
          {loading && (
            <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Analyzing your request and mapping preferences...</p>
            </div>
          )}
          
          {/* AI Success Message & Explanation */}
          {results && !loading && (
            <div className="mt-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800/30 animate-fadeIn">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                    {results.explanation || "Here's what I found for you."}
                  </p>
                  {renderFilters(results.extractedFilters)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Results Display Frame */}
      {results && results.count > 0 && (
        <div className="animate-fadeIn mt-8">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Found {results.count} Match{results.count > 1 ? 'es' : ''}
            </h3>
            <button onClick={() => setResults(null)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
              Clear Results
            </button>
          </div>

          {searchType === 'hotels' ? (
            /* Hotel Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.hotels.map((hotel) => (
                <div key={hotel._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                  <div className="relative overflow-hidden aspect-video bg-slate-100">
                    <img
                      src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60'}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black text-white shadow flex items-center gap-1 border border-white/10">
                      <span className="text-amber-400">★</span> {hotel.rating || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1.5 block">
                      {hotel.city}
                    </span>
                    <h4 className="text-lg font-black text-slate-800 dark:text-white tracking-tight mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {hotel.name}
                    </h4>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Per Night</span>
                        <span className="text-xl font-black text-slate-900 dark:text-white">₹{hotel.pricePerNight}</span>
                      </div>
                      <Link
                        to={`/hotels/${hotel._id}`}
                        className="bg-slate-900 dark:bg-slate-700 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow active:scale-95"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Flight List */
            <div className="space-y-4">
              {results.flights.map((flight) => (
                <div key={flight._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 text-xl border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                      ✈️
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-slate-800 dark:text-white text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                          {flight.airline}
                        </h4>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-bold uppercase tracking-wider">
                          {flight.flightNumber}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-3">
                        <span className="text-slate-800 dark:text-slate-200">{flight.source}</span>
                        <span className="text-slate-300 dark:text-slate-600">➔</span>
                        <span className="text-slate-800 dark:text-slate-200">{flight.destination}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
                    <div className="sm:text-right">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Fare</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">₹{flight.price}</span>
                    </div>
                    <Link
                      to={`/flights/${flight._id}`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {results && results.count === 0 && (
        <div className="text-center py-20 px-4 max-w-md mx-auto animate-fadeIn bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">No Results Found</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            We couldn't find any {searchType} matching your exact preferences. Try broadening your search or choosing a different location.
          </p>
          <button onClick={() => { setQuery(''); setResults(null); }} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-6 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors">
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}