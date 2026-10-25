import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeftRight, Sparkles, SlidersHorizontal, RefreshCw, TrendingUp, Check, ChevronDown, AlertCircle } from 'lucide-react';

export default function Header({ 
  stock1, 
  stock2, 
  onSelectStock1, 
  onSelectStock2, 
  onSwap, 
  onRefresh, 
  isLoading,
  popularDuels,
  onSelectDuel,
  onOpenFeatureDrawer,
  mode,
  setMode
}) {
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [results1, setResults1] = useState([]);
  const [results2, setResults2] = useState([]);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const dropdown1Ref = useRef(null);
  const dropdown2Ref = useRef(null);

  // Search API for Stock 1
  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(search1)}`);
        if (res.ok) {
          const data = await res.json();
          setResults1(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSearch();
  }, [search1]);

  // Search API for Stock 2
  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(search2)}`);
        if (res.ok) {
          const data = await res.json();
          setResults2(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSearch();
  }, [search2]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdown1Ref.current && !dropdown1Ref.current.contains(event.target)) {
        setIsOpen1(false);
      }
      if (dropdown2Ref.current && !dropdown2Ref.current.contains(event.target)) {
        setIsOpen2(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-xl">
      {/* Top Banner with Indian Flag Accent & Mode Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-900">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-300">NSE & BSE Trusted Indian Equities</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
            Live Market Feed Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* ELI5 vs Pro Analyst Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setMode('eli5')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                mode === 'eli5'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 Beginner (ELI5)
            </button>
            <button
              onClick={() => setMode('pro')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                mode === 'pro'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Pro Analyst
            </button>
          </div>

          {/* Module Customizer Button */}
          <button
            onClick={onOpenFeatureDrawer}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white transition-all text-xs font-medium"
            title="Add or remove features and customize your dashboard layout"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Modular Features</span>
          </button>
        </div>
      </div>

      {/* Main Bar: Logo & Two Search Bars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-black text-slate-950 text-xl tracking-wider">
              FC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  FinClash <span className="text-emerald-400">India</span>
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  NSE/BSE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Compare Indian Stocks • Fundamentals • Technicals • Sentiments
              </p>
            </div>
          </div>

          {/* Dual Search Area: "First" & "Second" Search Bars */}
          <div className="w-full lg:w-auto flex-1 max-w-3xl flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-inner">
            
            {/* Search Bar 1: "First" */}
            <div className="relative flex-1" ref={dropdown1Ref}>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  First
                </span>
                <input
                  type="text"
                  placeholder="Search 1st Indian Company..."
                  value={search1 || (stock1 ? `${stock1.symbol} - ${stock1.name.split(' ')[0]}` : '')}
                  onChange={(e) => {
                    setSearch1(e.target.value);
                    setIsOpen1(true);
                  }}
                  onFocus={() => {
                    setSearch1('');
                    setIsOpen1(true);
                  }}
                  className="w-full bg-slate-950 text-slate-100 pl-16 pr-8 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 transition-all font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>

              {/* Autocomplete Dropdown 1 */}
              {isOpen1 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl max-h-72 overflow-y-auto z-50 p-1 divide-y divide-slate-800/60">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500">
                    Select First Indian Company
                  </div>
                  {results1.length > 0 ? (
                    results1.map((item) => (
                      <button
                        key={item.symbol}
                        onClick={() => {
                          onSelectStock1(item.symbol);
                          setSearch1('');
                          setIsOpen1(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between transition-colors ${
                          stock1?.symbol === item.symbol ? 'bg-emerald-950/40 border border-emerald-800/50' : ''
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                            {item.symbol}
                            <span className="text-[11px] text-slate-400 font-normal">({item.sector})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                            {item.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-white">₹{item.cmp?.toLocaleString('en-IN')}</div>
                          <div className={`text-[10px] font-mono font-semibold ${item.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {item.dayChangePercent >= 0 ? '+' : ''}{item.dayChangePercent}%
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-xs text-slate-400 text-center">
                      No Indian company found matching "{search1}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <button
              onClick={onSwap}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition-all border border-slate-700 active:scale-95 shrink-0"
              title="Swap First and Second Companies"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            {/* Search Bar 2: "Second" */}
            <div className="relative flex-1" ref={dropdown2Ref}>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40">
                  Second
                </span>
                <input
                  type="text"
                  placeholder="Search 2nd Indian Company..."
                  value={search2 || (stock2 ? `${stock2.symbol} - ${stock2.name.split(' ')[0]}` : '')}
                  onChange={(e) => {
                    setSearch2(e.target.value);
                    setIsOpen2(true);
                  }}
                  onFocus={() => {
                    setSearch2('');
                    setIsOpen2(true);
                  }}
                  className="w-full bg-slate-950 text-slate-100 pl-18 pr-8 py-2 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 transition-all font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>

              {/* Autocomplete Dropdown 2 */}
              {isOpen2 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl max-h-72 overflow-y-auto z-50 p-1 divide-y divide-slate-800/60">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500">
                    Select Second Indian Company
                  </div>
                  {results2.length > 0 ? (
                    results2.map((item) => (
                      <button
                        key={item.symbol}
                        onClick={() => {
                          onSelectStock2(item.symbol);
                          setSearch2('');
                          setIsOpen2(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between transition-colors ${
                          stock2?.symbol === item.symbol ? 'bg-sky-950/40 border border-sky-800/50' : ''
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                            {item.symbol}
                            <span className="text-[11px] text-slate-400 font-normal">({item.sector})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                            {item.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-white">₹{item.cmp?.toLocaleString('en-IN')}</div>
                          <div className={`text-[10px] font-mono font-semibold ${item.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {item.dayChangePercent >= 0 ? '+' : ''}{item.dayChangePercent}%
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-xs text-slate-400 text-center">
                      No Indian company found matching "{search2}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 active:scale-95 shrink-0 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Fetch latest live prices and recalculate ratings"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

        </div>

        {/* Popular Indian Duels Presets */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Popular Rivalries:
          </span>
          {popularDuels && popularDuels.map((duel) => {
            const isActive = (stock1?.symbol === duel.symbol1 && stock2?.symbol === duel.symbol2) ||
                             (stock1?.symbol === duel.symbol2 && stock2?.symbol === duel.symbol1);
            return (
              <button
                key={duel.id}
                onClick={() => onSelectDuel(duel.symbol1, duel.symbol2)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{duel.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                  {duel.tag}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
