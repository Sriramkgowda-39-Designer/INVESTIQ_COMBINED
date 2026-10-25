import React, { useState } from 'react';
import { Sliders, Sparkles, TrendingUp, TrendingDown, HelpCircle, ShieldCheck } from 'lucide-react';
import GlossaryTooltip from '../common/GlossaryTooltip';

export default function ScenarioSimulatorModule({ company1, company2 }) {
  const [selectedScenario, setSelectedScenario] = useState('rateHike');

  if (!company1 || !company2) return null;

  const scenarios = [
    {
      id: 'rateHike',
      name: '🏦 RBI Hikes Repo Rate (+50 bps)',
      description: 'Reserve Bank of India tightens monetary policy to combat inflation, raising corporate borrowing costs.',
      calculate: (company) => {
        const isBank = company.sector.toLowerCase().includes('bank');
        if (isBank) {
          return {
            impact: 'Positive (+2.5% Margin Expansion)',
            type: 'positive',
            detail: 'Banks reprice floating rate loans faster than term deposits, boosting Net Interest Margins (NIM).'
          };
        }
        if (company.debtToEquity > 1.0) {
          return {
            impact: 'Severe Drag (-4.2% EPS Impact)',
            type: 'negative',
            detail: `High debt-to-equity (${company.debtToEquity}x) inflates annual interest expense.`
          };
        }
        return {
          impact: 'Neutral / Resilient (-0.4% Impact)',
          type: 'neutral',
          detail: `Virtually debt-free balance sheet (D/E: ${company.debtToEquity}x) shields company from interest spikes.`
        };
      }
    },
    {
      id: 'rupeeFall',
      name: '💵 USD/INR Depreciates by 3.5%',
      description: 'US Dollar strengthens against the Indian Rupee, inflating landed import costs while boosting dollar export revenues.',
      calculate: (company) => {
        const isIT = company.sector.toLowerCase().includes('information technology') || company.sector.toLowerCase().includes('tech');
        const isPharma = company.sector.toLowerCase().includes('pharma');

        if (isIT || isPharma) {
          return {
            impact: 'Major Boost (+3.8% Operating Margin)',
            type: 'positive',
            detail: 'Over 80% of revenues are invoiced in USD/EUR while employee costs remain in INR.'
          };
        }
        if (company.sector.toLowerCase().includes('auto') || company.sector.toLowerCase().includes('metal')) {
          return {
            impact: 'Mild Negative (-1.8% Margin Drag)',
            type: 'negative',
            detail: 'Higher landed costs for imported components, electronic chips, and coking coal.'
          };
        }
        return {
          impact: 'Negligible Domestic Impact',
          type: 'neutral',
          detail: 'Predominantly domestic currency revenue and supply chain base.'
        };
      }
    },
    {
      id: 'oilSurge',
      name: '🛢️ Brent Crude Jumps to $95 / bbl',
      description: 'Geopolitical supply choke pushes global crude oil prices up by 25%.',
      calculate: (company) => {
        if (company.symbol === 'RELIANCE') {
          return {
            impact: 'Windfall GRMs (+4.5% EBITDA Boost)',
            type: 'positive',
            detail: 'Refining complex captures wider Gross Refining Margins (GRMs) on diesel and jet fuel exports.'
          };
        }
        if (company.sector.toLowerCase().includes('auto') || company.sector.toLowerCase().includes('fmcg')) {
          return {
            impact: 'Headwind (-2.1% Operating Margin)',
            type: 'negative',
            detail: 'Higher consumer fuel costs temper vehicle buying; packaging and freight costs rise.'
          };
        }
        return {
          impact: 'Limited Direct Impact',
          type: 'neutral',
          detail: 'Services or technology companies have minimal direct crude derivative exposure.'
        };
      }
    }
  ];

  const currentScenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];
  const impact1 = currentScenario.calculate(company1);
  const impact2 = currentScenario.calculate(company2);

  const getImpactBadge = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'negative':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sliders className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Interactive "What-If" Market Simulator
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Simulation Lab
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test how real Indian macro shocks (interest rates, currency shifts, oil) affect each company's bottom line.
          </p>
        </div>
      </div>

      {/* Scenario Selection Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setSelectedScenario(sc.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedScenario === sc.id
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-extrabold'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {sc.name}
          </button>
        ))}
      </div>

      {/* Scenario Explanation Card */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 mb-6">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Scenario Overview:</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {currentScenario.description}
        </p>
      </div>

      {/* Side-by-Side Simulation Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Impact on Company 1 */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              {company1.symbol} Simulated Reaction
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getImpactBadge(impact1.type)}`}>
              {impact1.impact}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            {impact1.detail}
          </p>
        </div>

        {/* Impact on Company 2 */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              {company2.symbol} Simulated Reaction
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getImpactBadge(impact2.type)}`}>
              {impact2.impact}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            {impact2.detail}
          </p>
        </div>

      </div>

    </div>
  );
}
