import React from 'react';
import { Layers, CheckCircle2, TrendingUp, DollarSign, PieChart, Shield } from 'lucide-react';
import GlossaryTooltip from '../common/GlossaryTooltip';

export default function FundamentalModule({ company1, company2 }) {
  if (!company1 || !company2) return null;

  const renderMetricRow = ({ label, key, val1, val2, suffix = '', prefix = '', lowerIsBetter = false, format = 'num' }) => {
    let formattedVal1 = val1;
    let formattedVal2 = val2;

    if (format === 'inr') {
      formattedVal1 = `₹${val1?.toLocaleString('en-IN')}`;
      formattedVal2 = `₹${val2?.toLocaleString('en-IN')}`;
    } else if (format === 'cr') {
      formattedVal1 = `₹${(val1 / 1000).toFixed(1)}k Cr`;
      formattedVal2 = `₹${(val2 / 1000).toFixed(1)}k Cr`;
    } else {
      formattedVal1 = `${prefix}${val1}${suffix}`;
      formattedVal2 = `${prefix}${val2}${suffix}`;
    }

    const isVal1Better = lowerIsBetter ? val1 < val2 : val1 > val2;
    const isVal2Better = lowerIsBetter ? val2 < val1 : val2 > val1;

    return (
      <tr className="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors text-xs sm:text-sm">
        <td className="py-3 px-4 font-medium text-slate-300">
          <GlossaryTooltip termKey={key}>{label}</GlossaryTooltip>
        </td>

        <td className="py-3 px-4 text-center font-mono">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold ${
            isVal1Better 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
              : 'text-slate-300'
          }`}>
            {formattedVal1}
            {isVal1Better && <span className="text-[10px]">👑</span>}
          </span>
        </td>

        <td className="py-3 px-4 text-center font-mono">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold ${
            isVal2Better 
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' 
              : 'text-slate-300'
          }`}>
            {formattedVal2}
            {isVal2Better && <span className="text-[10px]">👑</span>}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Fundamental Valuation & Balance Sheet Clash
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hover over any term to understand how professional analysts evaluate balance sheets.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 font-bold">
            👑 Crown = Category Leader
          </span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/60 mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-3 px-4">Financial Metric</th>
              <th className="py-3 px-4 text-center text-emerald-400">{company1.symbol} (First)</th>
              <th className="py-3 px-4 text-center text-sky-400">{company2.symbol} (Second)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {/* Valuation Group */}
            <tr className="bg-slate-900/30">
              <td colSpan={3} className="py-1.5 px-4 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                1. Valuation Multiples
              </td>
            </tr>
            {renderMetricRow({ label: "P/E Ratio", key: "peRatio", val1: company1.peRatio, val2: company2.peRatio, suffix: "x", lowerIsBetter: true })}
            {renderMetricRow({ label: "Industry P/E", key: "industryPe", val1: company1.industryPe, val2: company2.industryPe, suffix: "x" })}
            {renderMetricRow({ label: "Price to Book (P/B)", key: "pbRatio", val1: company1.pbRatio, val2: company2.pbRatio, suffix: "x", lowerIsBetter: true })}
            {renderMetricRow({ label: "Market Capitalization", key: "marketCap", val1: company1.marketCap, val2: company2.marketCap, format: "cr" })}
            {renderMetricRow({ label: "Earnings Per Share (EPS)", key: "eps", val1: company1.eps, val2: company2.eps, prefix: "₹" })}
            {renderMetricRow({ label: "Dividend Yield", key: "dividendYield", val1: company1.dividendYield, val2: company2.dividendYield, suffix: "%" })}

            {/* Profitability Group */}
            <tr className="bg-slate-900/30">
              <td colSpan={3} className="py-1.5 px-4 text-[10px] font-black uppercase tracking-wider text-sky-400">
                2. Profitability & Efficiency
              </td>
            </tr>
            {renderMetricRow({ label: "Return on Equity (ROE)", key: "roe", val1: company1.roe, val2: company2.roe, suffix: "%" })}
            {renderMetricRow({ label: "Return on Capital Employed (ROCE)", key: "roce", val1: company1.roce, val2: company2.roce, suffix: "%" })}
            {renderMetricRow({ label: "Operating Margin (OPM)", key: "operatingMargin", val1: company1.operatingMargin, val2: company2.operatingMargin, suffix: "%" })}
            {renderMetricRow({ label: "3-Year Profit Growth (CAGR)", key: "profitGrowth3yr", val1: company1.profitGrowth3yr, val2: company2.profitGrowth3yr, suffix: "%" })}
            {renderMetricRow({ label: "3-Year Sales Growth (CAGR)", key: "salesGrowth3yr", val1: company1.salesGrowth3yr, val2: company2.salesGrowth3yr, suffix: "%" })}
            {renderMetricRow({ label: "Free Cash Flow (FCF)", key: "freeCashFlow", val1: company1.freeCashFlow, val2: company2.freeCashFlow, format: "cr" })}

            {/* Solvency & Governance */}
            <tr className="bg-slate-900/30">
              <td colSpan={3} className="py-1.5 px-4 text-[10px] font-black uppercase tracking-wider text-amber-400">
                3. Solvency & Shareholding Patterns
              </td>
            </tr>
            {renderMetricRow({ label: "Debt-to-Equity Ratio", key: "debtToEquity", val1: company1.debtToEquity, val2: company2.debtToEquity, suffix: "x", lowerIsBetter: true })}
            {renderMetricRow({ label: "Promoter Holding", key: "promoterHolding", val1: company1.promoterHolding, val2: company2.promoterHolding, suffix: "%" })}
            {renderMetricRow({ label: "Pledged Promoter Shares", key: "promoterHolding", val1: company1.pledgedPromoter, val2: company2.pledgedPromoter, suffix: "%", lowerIsBetter: true })}
            {renderMetricRow({ label: "FII / FPI Holding", key: "fiiHolding", val1: company1.fiiHolding, val2: company2.fiiHolding, suffix: "%" })}
            {renderMetricRow({ label: "DII Institutional Holding", key: "diiHolding", val1: company1.diiHolding, val2: company2.diiHolding, suffix: "%" })}
          </tbody>
        </table>
      </div>

      {/* Shareholding Visual Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Company 1 Ownership Distribution */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
            <span className="flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-emerald-400" />
              {company1.symbol} Ownership Pattern
            </span>
            <span className="text-[10px] text-slate-400 font-mono">100% Total</span>
          </div>

          <div className="h-3 rounded-full bg-slate-800 flex overflow-hidden">
            <div style={{ width: `${company1.promoterHolding}%` }} className="bg-emerald-500" title={`Promoter: ${company1.promoterHolding}%`}></div>
            <div style={{ width: `${company1.fiiHolding}%` }} className="bg-sky-500" title={`FII: ${company1.fiiHolding}%`}></div>
            <div style={{ width: `${company1.diiHolding}%` }} className="bg-amber-500" title={`DII: ${company1.diiHolding}%`}></div>
            <div style={{ width: `${company1.publicHolding}%` }} className="bg-purple-500" title={`Public: ${company1.publicHolding}%`}></div>
          </div>

          <div className="grid grid-cols-4 gap-1 text-[10px] mt-2.5 text-center text-slate-300 font-mono">
            <div><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>Promoter: {company1.promoterHolding}%</div>
            <div><span className="inline-block w-2 h-2 rounded-full bg-sky-500 mr-1"></span>FII: {company1.fiiHolding}%</div>
            <div><span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span>DII: {company1.diiHolding}%</div>
            <div><span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1"></span>Public: {company1.publicHolding}%</div>
          </div>
        </div>

        {/* Company 2 Ownership Distribution */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
            <span className="flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-sky-400" />
              {company2.symbol} Ownership Pattern
            </span>
            <span className="text-[10px] text-slate-400 font-mono">100% Total</span>
          </div>

          <div className="h-3 rounded-full bg-slate-800 flex overflow-hidden">
            <div style={{ width: `${company2.promoterHolding}%` }} className="bg-sky-500" title={`Promoter: ${company2.promoterHolding}%`}></div>
            <div style={{ width: `${company2.fiiHolding}%` }} className="bg-blue-500" title={`FII: ${company2.fiiHolding}%`}></div>
            <div style={{ width: `${company2.diiHolding}%` }} className="bg-amber-500" title={`DII: ${company2.diiHolding}%`}></div>
            <div style={{ width: `${company2.publicHolding}%` }} className="bg-purple-500" title={`Public: ${company2.publicHolding}%`}></div>
          </div>

          <div className="grid grid-cols-4 gap-1 text-[10px] mt-2.5 text-center text-slate-300 font-mono">
            <div><span className="inline-block w-2 h-2 rounded-full bg-sky-500 mr-1"></span>Promoter: {company2.promoterHolding}%</div>
            <div><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>FII: {company2.fiiHolding}%</div>
            <div><span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span>DII: {company2.diiHolding}%</div>
            <div><span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1"></span>Public: {company2.publicHolding}%</div>
          </div>
        </div>

      </div>

    </div>
  );
}
