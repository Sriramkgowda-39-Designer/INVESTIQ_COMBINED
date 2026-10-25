import React from 'react';
import { Trophy, Check, Sparkles, HelpCircle } from 'lucide-react';
import GlossaryTooltip from '../common/GlossaryTooltip';

export default function QuickDuelSummaryModule({ company1, company2, duelMatrix }) {
  if (!company1 || !company2 || !duelMatrix) return null;

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Head-to-Head Duel Matrix (Who Wins Where?)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Instant verdict on which Indian contender leads across core business pillars.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Hover over any metric to learn how it works</span>
        </div>
      </div>

      {/* Grid of Duel Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {duelMatrix.map((item, idx) => {
          const isWinner1 = item.winner === company1.symbol;
          const isWinner2 = item.winner === company2.symbol;

          return (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-200">
                    <GlossaryTooltip termKey={item.tooltipKey}>
                      {item.metric}
                    </GlossaryTooltip>
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isWinner1 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }`}>
                    <Trophy className="w-3 h-3" />
                    {item.winner} Leads
                  </span>
                </div>

                {/* Values comparison */}
                <div className="grid grid-cols-2 gap-2 my-2 py-2 border-y border-slate-900 text-xs font-mono">
                  <div className={`p-2 rounded-lg ${isWinner1 ? 'bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 font-bold' : 'text-slate-400'}`}>
                    <span className="text-[10px] uppercase block font-sans text-slate-500">{company1.symbol}</span>
                    {item.display1}
                  </div>

                  <div className={`p-2 rounded-lg ${isWinner2 ? 'bg-sky-950/30 border border-sky-900/40 text-sky-300 font-bold' : 'text-slate-400'}`}>
                    <span className="text-[10px] uppercase block font-sans text-slate-500">{company2.symbol}</span>
                    {item.display2}
                  </div>
                </div>
              </div>

              {/* Takeaway Insight */}
              <div className="text-[11px] text-slate-400 mt-2 flex items-start gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                <span>{item.insight}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
