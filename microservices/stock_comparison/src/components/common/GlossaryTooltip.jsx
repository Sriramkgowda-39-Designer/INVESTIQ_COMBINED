import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, AlertTriangle, BookOpen, X } from 'lucide-react';
import { financialGlossary } from '../../data/financialGlossary';

export default function GlossaryTooltip({ termKey, children, className = "", showIcon = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placeAbove: false });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const termData = financialGlossary[termKey] || {
    term: termKey,
    category: "Market Concept",
    eli5: "Hover over this term to inspect its meaning and investment importance.",
    formula: "Standard exchange calculation.",
    whyItMatters: "Helps you evaluate company value and performance.",
    benchmarks: {
      green: "Higher is generally favorable for profitability; lower for valuation multiples.",
      red: "Unfavorable deviation from industry peers."
    },
    example: "Refer to stock fundamentals."
  };

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const placeAbove = rect.bottom + 320 > window.innerHeight;
      
      let left = rect.left;
      // Prevent overflowing right edge
      if (left + 360 > window.innerWidth) {
        left = window.innerWidth - 370;
      }
      if (left < 10) left = 10;

      setCoords({
        top: placeAbove ? rect.top - 8 : rect.bottom + 8,
        left,
        placeAbove
      });
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <span 
      className="relative inline-flex items-center group cursor-help"
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className={`border-b border-dashed border-slate-500 hover:border-emerald-400 hover:text-emerald-300 transition-colors ${className}`}>
        {children || termData.term}
      </span>

      {showIcon && (
        <HelpCircle className="w-3.5 h-3.5 ml-1 text-slate-500 group-hover:text-emerald-400 transition-colors inline-block" />
      )}

      {isOpen && (
        <div 
          ref={tooltipRef}
          style={{
            position: 'fixed',
            top: coords.placeAbove ? 'auto' : `${coords.top}px`,
            bottom: coords.placeAbove ? `${window.innerHeight - coords.top}px` : 'auto',
            left: `${coords.left}px`,
            zIndex: 9999
          }}
          className="w-92 max-w-[90vw] p-4 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {termData.category}
              </span>
              <h4 className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                {termData.term}
              </h4>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Simple Explanation (ELI5) */}
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mb-0.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>What it means (in simple words):</span>
              </div>
              <p className="text-slate-300 leading-relaxed bg-slate-800/60 p-2 rounded-lg border border-slate-800">
                {termData.eli5}
              </p>
            </div>

            {/* Formula */}
            {termData.formula && (
              <div className="text-[11px] bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-medium">Formula: </span>
                <code className="text-emerald-300 font-mono text-[11px]">{termData.formula}</code>
              </div>
            )}

            {/* Why it matters */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400">Why it matters: </span>
              <span className="text-slate-300">{termData.whyItMatters}</span>
            </div>

            {/* Benchmarks (Good vs Caution) */}
            {termData.benchmarks && (
              <div className="grid grid-cols-1 gap-1.5 pt-1 border-t border-slate-800/70">
                <div className="flex items-start gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/20 p-1.5 rounded border border-emerald-900/30">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                  <span><strong>Healthy:</strong> {termData.benchmarks.green}</span>
                </div>
                <div className="flex items-start gap-1.5 text-[11px] text-rose-400 bg-rose-950/20 p-1.5 rounded border border-rose-900/30">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                  <span><strong>Caution:</strong> {termData.benchmarks.red}</span>
                </div>
              </div>
            )}

            {/* Example */}
            {termData.example && (
              <div className="text-[11px] text-slate-400 italic bg-slate-800/30 p-1.5 rounded">
                💡 <strong>Example:</strong> {termData.example}
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
