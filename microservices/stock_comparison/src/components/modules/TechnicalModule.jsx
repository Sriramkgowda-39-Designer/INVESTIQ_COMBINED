import React from 'react';
import { Gauge, TrendingUp, TrendingDown, Activity, Compass, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GlossaryTooltip from '../common/GlossaryTooltip';

export default function TechnicalModule({ company1, company2 }) {
  if (!company1 || !company2) return null;

  const render52WeekRange = (company, colorClass, borderClass) => {
    const min = company.low52w || 1;
    const max = company.high52w || 100;
    const current = company.cmp || min;
    const pct = Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100));

    return (
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></span>
            {company.symbol} 52-Week Price Range
          </span>
          <span className="font-mono text-slate-300 font-bold">
            {pct.toFixed(0)}% of Range
          </span>
        </div>

        {/* Range Slider */}
        <div className="relative pt-3 pb-1">
          <div className="h-2 rounded-full bg-slate-800 w-full relative">
            <div 
              className={`h-full rounded-full ${colorClass}`} 
              style={{ width: `${pct}%` }}
            ></div>
          </div>
          {/* Slider Pin */}
          <div 
            className="absolute top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-950 shadow-md pointer-events-none"
            style={{ left: `${pct}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div>
            <GlossaryTooltip termKey="low52w">52W Low</GlossaryTooltip>: <span className="text-white font-bold">₹{min.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <GlossaryTooltip termKey="cmp">CMP</GlossaryTooltip>: <span className="text-emerald-400 font-bold">₹{current.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <GlossaryTooltip termKey="high52w">52W High</GlossaryTooltip>: <span className="text-white font-bold">₹{max.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderRsiMeter = (company, rsiValue, labelColor) => {
    let rsiStatus = "Neutral / Healthy";
    let statusColor = "text-emerald-400 bg-emerald-950/40 border-emerald-800/40";
    if (rsiValue > 70) {
      rsiStatus = "Overbought (Correction Alert)";
      statusColor = "text-rose-400 bg-rose-950/40 border-rose-800/40";
    } else if (rsiValue < 35) {
      rsiStatus = "Oversold (Bounce Zone)";
      statusColor = "text-amber-400 bg-amber-950/40 border-amber-800/40";
    }

    return (
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            {company.symbol} RSI (14 Days)
          </span>
          <span className="font-mono text-lg font-black text-white">{rsiValue}</span>
        </div>

        {/* 3-Zone RSI Bar (0-30 Oversold, 30-70 Normal, 70-100 Overbought) */}
        <div className="h-2.5 rounded-full bg-slate-800 flex overflow-hidden relative">
          <div className="w-[30%] bg-amber-500/30 border-r border-slate-900" title="Oversold zone (0-30)"></div>
          <div className="w-[40%] bg-emerald-500/40 border-r border-slate-900" title="Neutral zone (30-70)"></div>
          <div className="w-[30%] bg-rose-500/30" title="Overbought zone (70-100)"></div>
          
          {/* Indicator Marker */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{ left: `${rsiValue}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-500">0 (Oversold)</span>
          <span className={`px-2 py-0.5 rounded font-bold border ${statusColor}`}>
            {rsiStatus}
          </span>
          <span className="text-slate-500">100 (Overbought)</span>
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
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Gauge className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Technical Momentum & Trend Indicators
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyze moving averages, RSI oscillator momentum, and volatility indicators side-by-side.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <GlossaryTooltip termKey="rsi">Learn RSI & DMA Signals</GlossaryTooltip>
        </div>
      </div>

      {/* 52-Week Range Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {render52WeekRange(company1, 'bg-emerald-500', 'border-emerald-500/40')}
        {render52WeekRange(company2, 'bg-sky-500', 'border-sky-500/40')}
      </div>

      {/* Moving Average & Trend Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Company 1: 50 DMA */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">
            <GlossaryTooltip termKey="dma50">{company1.symbol} 50-DMA</GlossaryTooltip>
          </div>
          <div className="text-lg font-black font-mono text-white mt-1">
            ₹{company1.dma50?.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] flex items-center gap-1 font-semibold">
            {company1.cmp >= company1.dma50 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Above 50-DMA (Bullish)
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" /> Below 50-DMA (Weak)
              </span>
            )}
          </div>
        </div>

        {/* Company 1: 200 DMA */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">
            <GlossaryTooltip termKey="dma200">{company1.symbol} 200-DMA</GlossaryTooltip>
          </div>
          <div className="text-lg font-black font-mono text-white mt-1">
            ₹{company1.dma200?.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] flex items-center gap-1 font-semibold">
            {company1.cmp >= company1.dma200 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Long Bull Trend
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" /> Long Consolidation
              </span>
            )}
          </div>
        </div>

        {/* Company 2: 50 DMA */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">
            <GlossaryTooltip termKey="dma50">{company2.symbol} 50-DMA</GlossaryTooltip>
          </div>
          <div className="text-lg font-black font-mono text-white mt-1">
            ₹{company2.dma50?.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] flex items-center gap-1 font-semibold">
            {company2.cmp >= company2.dma50 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Above 50-DMA (Bullish)
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" /> Below 50-DMA (Weak)
              </span>
            )}
          </div>
        </div>

        {/* Company 2: 200 DMA */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">
            <GlossaryTooltip termKey="dma200">{company2.symbol} 200-DMA</GlossaryTooltip>
          </div>
          <div className="text-lg font-black font-mono text-white mt-1">
            ₹{company2.dma200?.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] flex items-center gap-1 font-semibold">
            {company2.cmp >= company2.dma200 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Long Bull Trend
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" /> Long Consolidation
              </span>
            )}
          </div>
        </div>

      </div>

      {/* RSI Speedometers & Volatility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderRsiMeter(company1, company1.rsi, 'text-emerald-400')}
        {renderRsiMeter(company2, company2.rsi, 'text-sky-400')}
      </div>

      {/* Beta & MACD Comparison Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-400">
              <GlossaryTooltip termKey="beta">Beta (Market Volatility)</GlossaryTooltip>
            </div>
            <div className="font-mono text-sm font-bold text-white mt-0.5">
              {company1.symbol}: <span className={company1.beta < 1 ? 'text-emerald-400' : 'text-amber-400'}>{company1.beta}</span>
              {" vs "}
              {company2.symbol}: <span className={company2.beta < 1 ? 'text-sky-400' : 'text-amber-400'}>{company2.beta}</span>
            </div>
          </div>
          <div className="text-[11px] text-right text-slate-400">
            {company1.beta < company2.beta 
              ? `${company1.symbol} is less volatile during crashes` 
              : `${company2.symbol} is less volatile during crashes`}
          </div>
        </div>

        <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-400">
              <GlossaryTooltip termKey="macdSignal">MACD Trend Signal</GlossaryTooltip>
            </div>
            <div className="font-mono text-sm font-bold text-white mt-0.5">
              {company1.symbol}: <span className={company1.macdSignal === 'Bullish' ? 'text-emerald-400' : 'text-slate-400'}>{company1.macdSignal}</span>
              {" | "}
              {company2.symbol}: <span className={company2.macdSignal === 'Bullish' ? 'text-sky-400' : 'text-slate-400'}>{company2.macdSignal}</span>
            </div>
          </div>
          <div className="text-[11px] text-right text-slate-400">
            12/26 EMA Signal Oscillator
          </div>
        </div>
      </div>

    </div>
  );
}
