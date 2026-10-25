import React from 'react';
import { Smile, TrendingUp, Newspaper, CheckCircle2, Target, BarChart2 } from 'lucide-react';
import GlossaryTooltip from '../common/GlossaryTooltip';

export default function SentimentModule({ company1, company2 }) {
  if (!company1 || !company2) return null;

  const a1 = company1.analystRatings || { buyPercent: 70, holdPercent: 20, sellPercent: 10, consensus: "Buy", targetPrice: company1.cmp * 1.15 };
  const a2 = company2.analystRatings || { buyPercent: 70, holdPercent: 20, sellPercent: 10, consensus: "Buy", targetPrice: company2.cmp * 1.15 };

  const upside1 = Number((((a1.targetPrice - company1.cmp) / company1.cmp) * 100).toFixed(1));
  const upside2 = Number((((a2.targetPrice - company2.cmp) / company2.cmp) * 100).toFixed(1));

  const renderAnalystBar = (company, ratings, upside) => {
    return (
      <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              {company.symbol} Analyst Consensus
            </span>
            <div className="text-lg font-black text-white mt-1">
              Consensus: <span className="text-emerald-400">{ratings.consensus}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400">Street Target Price</div>
            <div className="text-base font-bold font-mono text-white">₹{ratings.targetPrice?.toLocaleString('en-IN')}</div>
            <div className={`text-[11px] font-mono font-bold ${upside >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {upside >= 0 ? `+${upside}% Potential Upside` : `${upside}% Downside`}
            </div>
          </div>
        </div>

        {/* Buy / Hold / Sell Triple Stacked Bar */}
        <div className="space-y-1">
          <div className="h-3 rounded-full bg-slate-800 flex overflow-hidden">
            <div style={{ width: `${ratings.buyPercent}%` }} className="bg-emerald-500" title={`Buy: ${ratings.buyPercent}%`}></div>
            <div style={{ width: `${ratings.holdPercent}%` }} className="bg-amber-500" title={`Hold: ${ratings.holdPercent}%`}></div>
            <div style={{ width: `${ratings.sellPercent}%` }} className="bg-rose-500" title={`Sell: ${ratings.sellPercent}%`}></div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span className="text-emerald-400 font-bold">🟢 Buy {ratings.buyPercent}%</span>
            <span className="text-amber-400 font-bold">🟡 Hold {ratings.holdPercent}%</span>
            <span className="text-rose-400 font-bold">🔴 Sell {ratings.sellPercent}%</span>
          </div>
        </div>

        {/* News Feed Highlights */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="text-[11px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
            <Newspaper className="w-3.5 h-3.5 text-slate-400" />
            Exchange News & Catalysts
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {company.newsHighlights && company.newsHighlights.map((n, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{n}</span>
              </li>
            ))}
          </ul>
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
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Smile className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Market Sentiment & Analyst Conviction
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregate institutional targets, broker ratings, and real-time business developments.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <GlossaryTooltip termKey="sentimentScore">How Sentiment is calculated</GlossaryTooltip>
        </div>
      </div>

      {/* Side-by-Side Analyst & News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderAnalystBar(company1, a1, upside1)}
        {renderAnalystBar(company2, a2, upside2)}
      </div>
    </div>
  );
}
