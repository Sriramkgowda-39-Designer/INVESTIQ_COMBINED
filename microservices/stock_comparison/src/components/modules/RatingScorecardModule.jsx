import React from 'react';
import { Award, Zap, TrendingUp, Smile, ShieldCheck, Info } from 'lucide-react';
import GlossaryTooltip from '../common/GlossaryTooltip';

export default function RatingScorecardModule({ company1, company2 }) {
  if (!company1 || !company2) return null;

  const r1 = company1.rating || {};
  const r2 = company2.rating || {};

  const renderScoreRow = (label, score1, score2, termKey, icon, isWinner1) => {
    return (
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-800 text-emerald-400">
              {icon}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-200">
              <GlossaryTooltip termKey={termKey}>{label}</GlossaryTooltip>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <span className={`px-2 py-0.5 rounded ${score1 >= score2 ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/50' : 'text-slate-400'}`}>
              {company1.symbol}: {score1}/100
            </span>
            <span className={`px-2 py-0.5 rounded ${score2 >= score1 ? 'text-sky-400 bg-sky-950/40 border border-sky-900/50' : 'text-slate-400'}`}>
              {company2.symbol}: {score2}/100
            </span>
          </div>
        </div>

        {/* Dual Progress Bars */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-14 font-mono font-bold text-emerald-400 shrink-0">{company1.symbol}</span>
            <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500" 
                style={{ width: `${score1}%` }}
              ></div>
            </div>
            <span className="w-8 text-right font-mono text-slate-300 font-semibold">{score1}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-14 font-mono font-bold text-sky-400 shrink-0">{company2.symbol}</span>
            <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-500" 
                style={{ width: `${score2}%` }}
              ></div>
            </div>
            <span className="w-8 text-right font-mono text-slate-300 font-semibold">{score2}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Dynamic AI Quality Scorecard
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
              Auto-updating Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ratings recalculated continuously across Fundamental Health, Technical Momentum, and News Sentiment.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Weights: Fundamentals (45%), Technicals (30%), Sentiment (25%)</span>
        </div>
      </div>

      {/* Main Composite Grade Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Company 1 Grade Card */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-500/30 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              {company1.symbol} Verdict
            </span>
            <h4 className="text-xl font-black text-white mt-2">
              {r1.verdict}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Composite Quality Score: <strong className="text-white font-mono">{r1.compositeScore} / 100</strong>
            </p>
          </div>

          <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg shadow-emerald-500/20">
            <span className="text-3xl leading-none">{r1.grade}</span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold mt-0.5">Rating</span>
          </div>
        </div>

        {/* Company 2 Grade Card */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-sky-500/30 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-sky-500/20 text-sky-400">
              {company2.symbol} Verdict
            </span>
            <h4 className="text-xl font-black text-white mt-2">
              {r2.verdict}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Composite Quality Score: <strong className="text-white font-mono">{r2.compositeScore} / 100</strong>
            </p>
          </div>

          <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg shadow-sky-500/20">
            <span className="text-3xl leading-none">{r2.grade}</span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold mt-0.5">Rating</span>
          </div>
        </div>

      </div>

      {/* Sub-Score Breakdown Rows */}
      <div className="space-y-3">
        {renderScoreRow(
          "Fundamental Health Score (45% Weight)",
          r1.fundamentalScore,
          r2.fundamentalScore,
          "roe",
          <ShieldCheck className="w-4 h-4" />,
          r1.fundamentalScore >= r2.fundamentalScore
        )}

        {renderScoreRow(
          "Technical Momentum Score (30% Weight)",
          r1.technicalScore,
          r2.technicalScore,
          "rsi",
          <TrendingUp className="w-4 h-4" />,
          r1.technicalScore >= r2.technicalScore
        )}

        {renderScoreRow(
          "Market Sentiment & Analyst Mood (25% Weight)",
          r1.sentimentScore,
          r2.sentimentScore,
          "sentimentScore",
          <Smile className="w-4 h-4" />,
          r1.sentimentScore >= r2.sentimentScore
        )}
      </div>

    </div>
  );
}
