import React from 'react';
import { X, SlidersHorizontal, Check, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { featureDefinitions } from '../../config/features';

export default function FeatureCustomizerDrawer({ 
  isOpen, 
  onClose, 
  featureFlags, 
  onToggleFeature, 
  onResetDefaults, 
  onEnableAll 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base">Modular Features</h3>
              <p className="text-xs text-slate-400">Easily add, remove, or toggle modules</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 my-4">
          <button
            onClick={onEnableAll}
            className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            Enable All
          </button>
          <button
            onClick={onResetDefaults}
            className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            Reset Defaults
          </button>
        </div>

        {/* Features Toggle List */}
        <div className="space-y-3 flex-1">
          {featureDefinitions.map((feat) => {
            const isEnabled = featureFlags[feat.key] !== false;

            return (
              <div 
                key={feat.key}
                onClick={() => onToggleFeature(feat.key)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isEnabled 
                    ? 'bg-slate-950 border-emerald-500/40 shadow-sm' 
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {feat.category}
                    </span>
                    <h4 className="text-xs font-bold text-white">
                      {feat.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {feat.description}
                  </p>
                </div>

                {/* Switch Toggle */}
                <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 mt-0.5 ${
                  isEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                }`}>
                  <div className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          💡 Preferences are automatically saved in local browser storage.
        </div>
      </div>
    </div>
  );
}
