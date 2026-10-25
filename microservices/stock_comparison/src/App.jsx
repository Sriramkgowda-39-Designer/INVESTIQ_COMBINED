import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import HeroClashBanner from './components/modules/HeroClashBanner';
import RatingScorecardModule from './components/modules/RatingScorecardModule';
import VulnerabilitiesModule from './components/modules/VulnerabilitiesModule';
import QuickDuelSummaryModule from './components/modules/QuickDuelSummaryModule';
import FundamentalModule from './components/modules/FundamentalModule';
import TechnicalModule from './components/modules/TechnicalModule';
import SentimentModule from './components/modules/SentimentModule';
import InteractiveChartModule from './components/modules/InteractiveChartModule';
import ScenarioSimulatorModule from './components/modules/ScenarioSimulatorModule';
import GlossaryHubModule from './components/modules/GlossaryHubModule';
import FeatureCustomizerDrawer from './components/layout/FeatureCustomizerDrawer';
import { defaultFeatureFlags } from './config/features';
import { Layers, Gauge, Smile, ShieldAlert, LineChart, Sliders, BookOpen, Trophy } from 'lucide-react';

export default function App() {
  // Default popular Indian company comparison: TCS vs Infosys
  const [sym1, setSym1] = useState('TCS');
  const [sym2, setSym2] = useState('INFY');
  const [comparisonData, setComparisonData] = useState(null);
  const [popularDuels, setPopularDuels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Beginner vs Pro Analyst mode
  const [mode, setMode] = useState('eli5'); // 'eli5' | 'pro'

  // Feature Flag State (Persisted in localStorage)
  const [featureFlags, setFeatureFlags] = useState(() => {
    try {
      const saved = localStorage.getItem('finclash_features');
      return saved ? JSON.parse(saved) : defaultFeatureFlags;
    } catch {
      return defaultFeatureFlags;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Save feature flags to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('finclash_features', JSON.stringify(featureFlags));
    } catch (e) {
      console.error(e);
    }
  }, [featureFlags]);

  // Fetch Popular Duels on load
  useEffect(() => {
    const fetchDuels = async () => {
      try {
        const res = await fetch('/api/stocks/popular-duels');
        if (res.ok) {
          const data = await res.json();
          setPopularDuels(data);
        }
      } catch (err) {
        console.error("Failed to load popular duels", err);
      }
    };
    fetchDuels();
  }, []);

  // Fetch Comparison Data
  const fetchComparison = async (s1 = sym1, s2 = sym2) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stocks/compare?sym1=${encodeURIComponent(s1)}&sym2=${encodeURIComponent(s2)}`);
      if (!res.ok) throw new Error("Failed to fetch comparison data");
      const data = await res.json();
      setComparisonData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison(sym1, sym2);
  }, [sym1, sym2]);

  // Handlers
  const handleSelectStock1 = (symbol) => {
    setSym1(symbol);
  };

  const handleSelectStock2 = (symbol) => {
    setSym2(symbol);
  };

  const handleSwap = () => {
    const temp = sym1;
    setSym1(sym2);
    setSym2(temp);
  };

  const handleSelectDuel = (s1, s2) => {
    setSym1(s1);
    setSym2(s2);
  };

  const handleToggleFeature = (key) => {
    setFeatureFlags(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleResetDefaults = () => {
    setFeatureFlags(defaultFeatureFlags);
  };

  const handleEnableAll = () => {
    const allEnabled = {};
    Object.keys(defaultFeatureFlags).forEach(k => allEnabled[k] = true);
    setFeatureFlags(allEnabled);
  };

  const tabs = [
    { id: 'overview', label: 'All Clash Insights', icon: <Trophy className="w-4 h-4" /> },
    { id: 'fundamentals', label: 'Fundamentals', icon: <Layers className="w-4 h-4" /> },
    { id: 'technicals', label: 'Technicals', icon: <Gauge className="w-4 h-4" /> },
    { id: 'sentiment', label: 'Sentiment & Risks', icon: <Smile className="w-4 h-4" /> },
    { id: 'simulator', label: 'What-If Simulator', icon: <Sliders className="w-4 h-4" /> },
    { id: 'glossary', label: 'Academy & Glossary', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Sticky Dual-Search Header */}
      <Header
        stock1={comparisonData?.company1}
        stock2={comparisonData?.company2}
        onSelectStock1={handleSelectStock1}
        onSelectStock2={handleSelectStock2}
        onSwap={handleSwap}
        onRefresh={() => fetchComparison(sym1, sym2)}
        isLoading={isLoading}
        popularDuels={popularDuels}
        onSelectDuel={handleSelectDuel}
        onOpenFeatureDrawer={() => setIsDrawerOpen(true)}
        mode={mode}
        setMode={setMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-slate-900 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-emerald-400 border border-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {isLoading && !comparisonData && (
          <div className="p-16 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-slate-300">
              Fetching live Indian market quotes and calculating risk metrics...
            </p>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-sm mb-6 flex items-center justify-between">
            <span>Failed to load stock data: {error}</span>
            <button 
              onClick={() => fetchComparison()} 
              className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-xs font-bold text-white"
            >
              Retry
            </button>
          </div>
        )}

        {comparisonData && (
          <>
            {/* Top Contender Clash Banner (Always Visible on all tabs) */}
            <HeroClashBanner
              company1={comparisonData.company1}
              company2={comparisonData.company2}
              scoreTally={comparisonData.scoreTally}
              lastRefreshed={comparisonData.lastRefreshed}
            />

            {/* TAB: Overview / All Clash Insights */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {/* 1. Dynamic Rating Scorecard */}
                {featureFlags.showRatingScorecard && (
                  <RatingScorecardModule
                    company1={comparisonData.company1}
                    company2={comparisonData.company2}
                  />
                )}

                {/* 2. Vulnerabilities & Red Flags */}
                {featureFlags.showVulnerabilities && (
                  <VulnerabilitiesModule
                    company1={comparisonData.company1}
                    company2={comparisonData.company2}
                  />
                )}

                {/* 3. Head-to-Head Duel Matrix */}
                {featureFlags.showQuickDuelSummary && (
                  <QuickDuelSummaryModule
                    company1={comparisonData.company1}
                    company2={comparisonData.company2}
                    duelMatrix={comparisonData.duelMatrix}
                  />
                )}

                {/* 4. Interactive 12-Month Performance Chart */}
                {featureFlags.showInteractiveChart && (
                  <InteractiveChartModule
                    company1={comparisonData.company1}
                    company2={comparisonData.company2}
                    chartData={comparisonData.chartData}
                  />
                )}

                {/* 5. Fundamental Analysis */}
                {featureFlags.showFundamentalAnalysis && (
                  <FundamentalModule
                    company1={comparisonData.company1}
                    company2={comparisonData.company2}
                  />
                )}

                {/* 6. Technical Room */}
                {featureFlags.showTechnicalAnalysis && (
                  <TechnicalModule
                    company1={comparisonData.company1}
                    company2={comparisonData.company2}
                  />
                )}

                {/* 7. Sentiment & News */}
                {featureFlags.showSentimentAnalysis && (
                  <SentimentModule
                    company1={comparisonData.company1}
                    company2={comparisonData.company2}
                  />
                )}

                {/* 8. What-If Simulator */}
                {featureFlags.showScenarioSimulator && (
                  <ScenarioSimulatorModule
                    company1={comparisonData.company1}
                    company2={comparisonData.company2}
                  />
                )}

                {/* 9. Glossary Hub */}
                {featureFlags.showGlossaryHub && (
                  <GlossaryHubModule />
                )}

              </div>
            )}

            {/* TAB: Fundamentals */}
            {activeTab === 'fundamentals' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <FundamentalModule
                  company1={comparisonData.company1}
                  company2={comparisonData.company2}
                />
                <QuickDuelSummaryModule
                  company1={comparisonData.company1}
                  company2={comparisonData.company2}
                  duelMatrix={comparisonData.duelMatrix.filter(d => ['peRatio', 'roe', 'roce', 'debtToEquity', 'operatingMargin'].includes(d.key))}
                />
              </div>
            )}

            {/* TAB: Technicals */}
            {activeTab === 'technicals' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <TechnicalModule
                  company1={comparisonData.company1}
                  company2={comparisonData.company2}
                />
                <InteractiveChartModule
                  company1={comparisonData.company1}
                  company2={comparisonData.company2}
                  chartData={comparisonData.chartData}
                />
              </div>
            )}

            {/* TAB: Sentiment & Risks */}
            {activeTab === 'sentiment' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <VulnerabilitiesModule
                  company1={comparisonData.company1}
                  company2={comparisonData.company2}
                />
                <SentimentModule
                  company1={comparisonData.company1}
                  company2={comparisonData.company2}
                />
              </div>
            )}

            {/* TAB: Simulator */}
            {activeTab === 'simulator' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <ScenarioSimulatorModule
                  company1={comparisonData.company1}
                  company2={comparisonData.company2}
                />
              </div>
            )}

            {/* TAB: Glossary & Academy */}
            {activeTab === 'glossary' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <GlossaryHubModule />
              </div>
            )}

          </>
        )}
      </main>

      {/* Feature Customizer Drawer */}
      <FeatureCustomizerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        featureFlags={featureFlags}
        onToggleFeature={handleToggleFeature}
        onResetDefaults={handleResetDefaults}
        onEnableAll={handleEnableAll}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">🇮🇳 FinClash India</span>
            <span>•</span>
            <span>Educational Indian Stock Comparison & Market Intelligence</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Data sourced from NSE/BSE corporate filings. For learning and analytical purposes.
          </div>
        </div>
      </footer>
    </div>
  );
}
