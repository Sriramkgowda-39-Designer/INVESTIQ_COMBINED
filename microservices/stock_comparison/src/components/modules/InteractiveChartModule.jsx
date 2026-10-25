import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { LineChart, Sparkles, Percent, DollarSign, ArrowUpRight } from 'lucide-react';
import GlossaryTooltip from '../common/GlossaryTooltip';

export default function InteractiveChartModule({ company1, company2, chartData }) {
  const [viewType, setViewType] = useState('return'); // 'return' or 'price'

  if (!company1 || !company2 || !chartData || chartData.length === 0) return null;

  const sym1 = company1.symbol;
  const sym2 = company2.symbol;

  const key1 = viewType === 'return' ? `${sym1}_return` : `${sym1}_price`;
  const key2 = viewType === 'return' ? `${sym2}_return` : `${sym2}_price`;

  const finalReturn1 = chartData[chartData.length - 1]?.[`${sym1}_return`] || 0;
  const finalReturn2 = chartData[chartData.length - 1]?.[`${sym2}_return`] || 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <div className="font-bold text-slate-300 mb-1.5 border-b border-slate-800 pb-1">{label}</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="font-semibold flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {viewType === 'return' ? `${entry.value >= 0 ? '+' : ''}${entry.value}%` : `₹${entry.value?.toLocaleString('en-IN')}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      {/* Header & View Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <LineChart className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Historical Performance Clash
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
              12 Months Trajectory
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare normalized wealth compounding returns or absolute rupee price trajectories.
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewType('return')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewType === 'return'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>% Return (Normalized)</span>
          </button>

          <button
            onClick={() => setViewType('price')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewType === 'price'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>₹ Absolute Price</span>
          </button>
        </div>
      </div>

      {/* Trajectory Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {sym1} 1-Year Compound Return
            </div>
            <div className={`text-xl font-black font-mono mt-1 ${finalReturn1 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {finalReturn1 >= 0 ? '+' : ''}{finalReturn1}%
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400">Current CMP</span>
            <div className="font-mono font-bold text-white text-sm">₹{company1.cmp?.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-sky-500/30 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              {sym2} 1-Year Compound Return
            </div>
            <div className={`text-xl font-black font-mono mt-1 ${finalReturn2 >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
              {finalReturn2 >= 0 ? '+' : ''}{finalReturn2}%
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400">Current CMP</span>
            <div className="font-mono font-bold text-white text-sm">₹{company2.cmp?.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorC1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorC2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis 
              stroke="#64748b" 
              tick={{ fontSize: 11 }} 
              tickFormatter={(v) => viewType === 'return' ? `${v}%` : `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} 
              iconType="circle"
            />
            <Area 
              type="monotone" 
              dataKey={key1} 
              name={company1.name} 
              stroke="#10b981" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorC1)" 
            />
            <Area 
              type="monotone" 
              dataKey={key2} 
              name={company2.name} 
              stroke="#38bdf8" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorC2)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
