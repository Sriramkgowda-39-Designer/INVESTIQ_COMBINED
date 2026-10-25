import React from 'react';
import { TrendingUp, TrendingDown, Award, ShieldAlert, Zap, Trophy, Building2, CheckCircle2 } from 'lucide-react';
import GlossaryTooltip from '../common/GlossaryTooltip';

export default function HeroClashBanner({ company1, company2, scoreTally, lastRefreshed }) {
  if (!company1 || !company2) return null;

  const r1 = company1.rating || {};
  const r2 = company2.rating || {};

  const getGradeBg = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-emerald-500/20';
      case 'A': return 'bg-emerald-600/20 text-emerald-400 border-emerald-600 shadow-emerald-600/20';
      case 'B+': return 'bg-blue-500/20 text-blue-300 border-blue-500 shadow-blue-500/20';
      case 'B': return 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-amber-500/20';
      case 'C': return 'bg-orange-500/20 text-orange-300 border-orange-500 shadow-orange-500/20';
      default: return 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-rose-500/20';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl mb-8">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      {/* Clash Meta & Tally */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Head-to-Head Duel
          </span>
          <span className="text-xs text-slate-400">
            Updated: <span className="font-mono text-slate-300">{lastRefreshed || 'Just now'}</span>
          </span>
        </div>

        {scoreTally && (
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-800">
            <span className="text-xs font-bold text-emerald-400">
              {company1.symbol} ({scoreTally[company1.symbol]} Wins)
            </span>
            <span className="text-xs text-slate-600 font-bold">vs</span>
            <span className="text-xs font-bold text-sky-400">
              {company2.symbol} ({scoreTally[company2.symbol]} Wins)
            </span>
            {scoreTally.leader !== 'Tied' && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                👑 {scoreTally.leader} Leading
              </span>
            )}
          </div>
        )}
      </div>

      {/* Side-by-Side Contenders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
        
        {/* Contender 1 (Left) */}
        <div className="lg:col-span-5 bg-slate-950/70 p-6 rounded-2xl border border-emerald-500/30 relative group hover:border-emerald-500/60 transition-all shadow-lg shadow-emerald-950/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  First Choice
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {company1.sector}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                {company1.symbol}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {company1.name}
              </p>
            </div>

            {/* Quality Rating Badge */}
            <div className="text-right">
              <div className={`inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl border shadow-lg ${getGradeBg(r1.grade)}`}>
                <span className="text-2xl font-black">{r1.grade}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">{r1.compositeScore}/100</span>
              </div>
              <div className="text-[10px] font-semibold text-emerald-400 mt-1">
                <GlossaryTooltip termKey="compositeRating">
                  {r1.verdict}
                </GlossaryTooltip>
              </div>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-end justify-between">
            <div>
              <div className="text-xs text-slate-400">
                <GlossaryTooltip termKey="cmp">Current Market Price (CMP)</GlossaryTooltip>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-0.5">
                ₹{company1.cmp?.toLocaleString('en-IN')}
              </div>
            </div>

            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
              company1.dayChangePercent >= 0 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}>
              {company1.dayChangePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{company1.dayChangePercent >= 0 ? '+' : ''}{company1.dayChangePercent}%</span>
              <span className="text-[11px] text-slate-400">({company1.dayChange >= 0 ? '+' : ''}₹{company1.dayChange})</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-900 text-xs">
            <div className="bg-slate-900/70 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400">
                <GlossaryTooltip termKey="peRatio">P/E Ratio</GlossaryTooltip>
              </div>
              <div className="font-mono font-bold text-white text-sm">{company1.peRatio}x</div>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400">
                <GlossaryTooltip termKey="roe">ROE</GlossaryTooltip>
              </div>
              <div className="font-mono font-bold text-emerald-400 text-sm">{company1.roe}%</div>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400">
                <GlossaryTooltip termKey="marketCap">M-Cap (Cr)</GlossaryTooltip>
              </div>
              <div className="font-mono font-bold text-slate-200 text-sm">₹{(company1.marketCap / 1000).toFixed(0)}k Cr</div>
            </div>
          </div>
        </div>

        {/* Center "VS" Badge */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center my-2 lg:my-0">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-xl shadow-slate-950 font-black text-amber-400 text-sm tracking-wider">
              VS
            </div>
          </div>
        </div>

        {/* Contender 2 (Right) */}
        <div className="lg:col-span-5 bg-slate-950/70 p-6 rounded-2xl border border-sky-500/30 relative group hover:border-sky-500/60 transition-all shadow-lg shadow-sky-950/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40">
                  Second Choice
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {company2.sector}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                {company2.symbol}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {company2.name}
              </p>
            </div>

            {/* Quality Rating Badge */}
            <div className="text-right">
              <div className={`inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl border shadow-lg ${getGradeBg(r2.grade)}`}>
                <span className="text-2xl font-black">{r2.grade}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">{r2.compositeScore}/100</span>
              </div>
              <div className="text-[10px] font-semibold text-sky-400 mt-1">
                <GlossaryTooltip termKey="compositeRating">
                  {r2.verdict}
                </GlossaryTooltip>
              </div>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-end justify-between">
            <div>
              <div className="text-xs text-slate-400">
                <GlossaryTooltip termKey="cmp">Current Market Price (CMP)</GlossaryTooltip>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-0.5">
                ₹{company2.cmp?.toLocaleString('en-IN')}
              </div>
            </div>

            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
              company2.dayChangePercent >= 0 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}>
              {company2.dayChangePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{company2.dayChangePercent >= 0 ? '+' : ''}{company2.dayChangePercent}%</span>
              <span className="text-[11px] text-slate-400">({company2.dayChange >= 0 ? '+' : ''}₹{company2.dayChange})</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-900 text-xs">
            <div className="bg-slate-900/70 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400">
                <GlossaryTooltip termKey="peRatio">P/E Ratio</GlossaryTooltip>
              </div>
              <div className="font-mono font-bold text-white text-sm">{company2.peRatio}x</div>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400">
                <GlossaryTooltip termKey="roe">ROE</GlossaryTooltip>
              </div>
              <div className="font-mono font-bold text-sky-400 text-sm">{company2.roe}%</div>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-lg">
              <div className="text-[10px] text-slate-400">
                <GlossaryTooltip termKey="marketCap">M-Cap (Cr)</GlossaryTooltip>
              </div>
              <div className="font-mono font-bold text-slate-200 text-sm">₹{(company2.marketCap / 1000).toFixed(0)}k Cr</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
