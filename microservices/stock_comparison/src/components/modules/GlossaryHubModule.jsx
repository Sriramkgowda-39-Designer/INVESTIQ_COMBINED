import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, CheckCircle2, AlertTriangle, HelpCircle, ChevronRight } from 'lucide-react';
import { financialGlossary } from '../../data/financialGlossary';

export default function GlossaryHubModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedKey, setExpandedKey] = useState(null);

  const categories = ['All', 'Valuation', 'Profitability', 'Technical & Pricing', 'Financial Health & Solvency', 'Corporate Governance', 'Institutional Ownership'];

  const filteredTerms = Object.entries(financialGlossary).filter(([key, data]) => {
    const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          data.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          data.eli5.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || data.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Stock Market Academy & Interactive Glossary
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
              {Object.keys(financialGlossary).length} Terms Explained
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master every Indian stock market concept in plain English with real-life benchmarks.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search terms (e.g. P/E, ROCE, CMP)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 pl-8 pr-3 py-1.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs placeholder:text-slate-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 text-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map(([key, data]) => {
          const isExpanded = expandedKey === key;

          return (
            <div 
              key={key}
              onClick={() => setExpandedKey(isExpanded ? null : key)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isExpanded 
                  ? 'bg-slate-950 border-emerald-500/50 shadow-lg shadow-emerald-950/20' 
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {data.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5 flex items-center gap-1.5">
                    {data.term}
                  </h4>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-emerald-400' : ''}`} />
              </div>

              {/* ELI5 preview */}
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {data.eli5}
              </p>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs animate-in fade-in duration-150">
                  {data.formula && (
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-[11px]">
                      <span className="text-slate-400 font-semibold">Formula: </span>
                      <code className="text-emerald-300 font-mono">{data.formula}</code>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 font-semibold">Why it matters: </span>
                    <span className="text-slate-200">{data.whyItMatters}</span>
                  </div>

                  {data.benchmarks && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-1.5 rounded border border-emerald-900/40">
                        <strong>Healthy Benchmark:</strong> {data.benchmarks.green}
                      </div>
                      <div className="text-[11px] text-rose-400 bg-rose-950/30 p-1.5 rounded border border-rose-900/40">
                        <strong>Warning Benchmark:</strong> {data.benchmarks.red}
                      </div>
                    </div>
                  )}

                  {data.example && (
                    <div className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded border border-slate-800">
                      💡 <strong>Real Example:</strong> {data.example}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
