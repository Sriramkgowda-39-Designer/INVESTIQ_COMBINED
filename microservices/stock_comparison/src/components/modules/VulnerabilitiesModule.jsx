import React from 'react';
import { AlertTriangle, ShieldAlert, AlertOctagon, Info, Flame, CheckCircle2 } from 'lucide-react';
import GlossaryTooltip from '../common/GlossaryTooltip';

export default function VulnerabilitiesModule({ company1, company2 }) {
  if (!company1 || !company2) return null;

  const vulns1 = company1.vulnerabilities || [];
  const vulns2 = company2.vulnerabilities || [];

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" />
            Critical Risk
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Moderate Risk
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
            <Info className="w-3 h-3 text-sky-400" />
            Watchlist
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Vulnerabilities & Red Flag Intelligence
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40">
              Risk Audit
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Unbiased detection of structural weaknesses, debt strain, valuation traps, and technical breakdown zones.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
          <span>Always examine risks before investing capital</span>
        </div>
      </div>

      {/* Side-by-Side Vulnerability Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Company 1 Vulnerabilities */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h4 className="font-bold text-white text-base">{company1.symbol}</h4>
              <span className="text-xs text-slate-400">({vulns1.length} Flagged Points)</span>
            </div>
            {company1.pledgedPromoter > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Pledge: {company1.pledgedPromoter}%
              </span>
            )}
          </div>

          <div className="space-y-3.5">
            {vulns1.length > 0 ? (
              vulns1.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      {item.title}
                    </h5>
                    {getSeverityBadge(item.severity)}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.explanation}
                  </p>

                  <div className="text-[11px] bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 text-rose-300">
                    <strong className="text-slate-300 font-semibold">Financial Impact: </strong>
                    {item.impact}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span>No severe structural vulnerabilities detected at this time.</span>
              </div>
            )}
          </div>
        </div>

        {/* Company 2 Vulnerabilities */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              <h4 className="font-bold text-white text-base">{company2.symbol}</h4>
              <span className="text-xs text-slate-400">({vulns2.length} Flagged Points)</span>
            </div>
            {company2.pledgedPromoter > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Pledge: {company2.pledgedPromoter}%
              </span>
            )}
          </div>

          <div className="space-y-3.5">
            {vulns2.length > 0 ? (
              vulns2.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      {item.title}
                    </h5>
                    {getSeverityBadge(item.severity)}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.explanation}
                  </p>

                  <div className="text-[11px] bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 text-rose-300">
                    <strong className="text-slate-300 font-semibold">Financial Impact: </strong>
                    {item.impact}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span>No severe structural vulnerabilities detected at this time.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
