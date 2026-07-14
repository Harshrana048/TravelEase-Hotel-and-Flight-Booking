import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, X, Trash2, Send, ChevronRight, MapPin, Plane, Hotel } from 'lucide-react';
import { searchHotelsWithAI, searchFlightsWithAI } from '../../services/ai';

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Load chat history
    const saved = localStorage.getItem('aiChatHistory');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    } else {
      // Initial greeting
      setMessages([{
        id: Date.now().toString(),
        sender: 'ai',
        type: 'text',
        content: "Hi! I'm your AI Travel Assistant. Where would you like to go?"
      }]);
    }
  }, []);

  const saveMessages = (msgs) => {
    setMessages(msgs);
    localStorage.setItem('aiChatHistory', JSON.stringify(msgs));
  };

  const clearChat = () => {
    const initMsg = [{
      id: Date.now().toString(),
      sender: 'ai',
      type: 'text',
      content: "Chat cleared! How can I help you plan your next trip?"
    }];
    saveMessages(initMsg);
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const userMsg = { id: Date.now().toString(), sender: 'user', type: 'text', content: text };
    const newMessages = [...messages, userMsg];
    saveMessages(newMessages);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    setIsTyping(true);

    try {
      // Very basic intent detection to choose API
      const isFlight = text.toLowerCase().includes('flight') || text.toLowerCase().includes('fly');
      const data = isFlight ? await searchFlightsWithAI(text) : await searchHotelsWithAI(text);
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        type: 'results',
        searchType: isFlight ? 'flights' : 'hotels',
        explanation: data.explanation || `Found ${data.count} results matching your request.`,
        filters: data.extractedFilters,
        results: data[isFlight ? 'flights' : 'hotels'] || []
      };
      
      saveMessages([...newMessages, aiResponse]);
    } catch (err) {
      saveMessages([...newMessages, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        type: 'error',
        content: "I'm sorry, I couldn't understand that or there was an error. Could you try rephrasing?"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  };

  const suggestionChips = [
    { text: "Luxury hotel in Mumbai", icon: <Hotel size={14} /> },
     { text: "Cheap beach resorts in Goa under 10000", icon: <Hotel size={14} /> },
    { text: "Direct Mumbai to delhi flights", icon: <Plane size={14} /> },
    { text: "Cheap flights to Goa", icon: <Plane size={14} /> },
    
  ];

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-linear-to-tr from-indigo-600 to-purple-600 shadow-2xl flex items-center justify-center text-white border-2 border-white/20 transition-all hover:shadow-indigo-500/50"
      >
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
          <Sparkles className="w-7 h-7" />
        </motion.div>
        
        {/* Soft pulse ring */}
        <span className="absolute inset-0 rounded-full border-4 border-indigo-400 opacity-20 animate-ping" style={{ animationDuration: '3s' }}></span>
      </motion.button>

      {/* Slide-over Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 sm:hidden"
            />
            
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-112.5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl border-l border-white/20 dark:border-slate-800 flex flex-col sm:m-4 sm:h-[calc(100vh-32px)] sm:rounded-3xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-indigo-600 to-purple-700 p-5 shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30 text-white">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">AI Travel Assistant</h3>
                      <p className="text-xs text-indigo-100/80 font-medium">Plan your perfect journey</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={clearChat} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Clear Chat">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors bg-black/20">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {suggestionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip.text)}
                        className="text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-full hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span className="text-indigo-500">{chip.icon}</span>
                        {chip.text}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div key={msg.id || idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${msg.sender === 'user' ? '' : 'flex gap-3'}`}>
                      {msg.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm border border-white dark:border-slate-800">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {msg.type === 'text' && (
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-100 dark:border-slate-700'}`}>
                            {msg.content}
                          </div>
                        )}

                        {msg.type === 'error' && (
                          <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-bl-sm border border-red-100 dark:border-red-800/50">
                            {msg.content}
                          </div>
                        )}

                        {msg.type === 'results' && (
                          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 rounded-bl-sm w-[320px] sm:w-85">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">{msg.explanation}</p>
                            
                            {/* Filter Pills */}
                            {msg.filters && (
                              <div className="flex flex-wrap gap-1.5 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                                {Object.entries(msg.filters).filter(([k,v]) => v !== null && !k.toLowerCase().includes('date')).map(([k,v]) => (
                                  <span key={k} className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold rounded-md flex items-center gap-1 border border-green-200 dark:border-green-800">
                                    ✓ {v}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Result Cards */}
                            <div className="space-y-3">
                              {msg.results.slice(0, 3).map((item, i) => (
                                <Link 
                                  key={item._id || i} 
                                  to={msg.searchType === 'hotels' ? `/hotels/${item._id}` : `/flights/${item._id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="group block rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500 transition-all bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800"
                                >
                                  {msg.searchType === 'hotels' ? (
                                    <div className="flex h-20">
                                      <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80'} className="w-20 h-full object-cover" alt="" />
                                      <div className="p-2 flex-1 flex flex-col justify-center">
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-indigo-600">{item.name}</h4>
                                        <div className="flex items-center justify-between mt-1">
                                          <span className="text-[10px] text-amber-500 font-bold">★ {item.rating || 'New'}</span>
                                          <span className="text-xs font-black text-slate-900 dark:text-white">₹{item.pricePerNight}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-3">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">{item.airline}</span>
                                        <span className="text-sm font-black text-slate-900 dark:text-white">₹{item.price}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                        <span>{item.source}</span>
                                        <ChevronRight size={12} className="text-slate-400" />
                                        <span>{item.destination}</span>
                                      </div>
                                    </div>
                                  )}
                                </Link>
                              ))}
                              
                              {msg.results.length > 3 && (
                                <div className="pt-2 text-center">
                                  <Link to={`/${msg.searchType}`} onClick={() => setIsOpen(false)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline">
                                    View all {msg.results.length} results
                                  </Link>
                                </div>
                              )}
                              {msg.results.length === 0 && (
                                <p className="text-xs text-slate-500 text-center py-2">No exact matches found.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm border border-white">
                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1.5 h-11">
                        <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                        <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                        <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-inner">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      autoResize();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your perfect trip..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-2 max-h-32 resize-none custom-scrollbar text-slate-800 dark:text-slate-100 placeholder-slate-400"
                    rows="1"
                    disabled={isTyping}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:dark:bg-slate-800 text-white rounded-xl transition-all shadow-sm shrink-0 mb-0.5"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="text-center mt-2">
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide">Powered by Gemini AI</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
