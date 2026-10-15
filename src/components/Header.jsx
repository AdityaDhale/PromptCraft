import React from 'react';
import { Play, Sparkles, Settings, Share2, Layers, Cpu, Check, Terminal } from 'lucide-react';

export function Header({
  presets,
  currentPresetId,
  onSelectPreset,
  isRunning,
  onRunBenchmark,
  onOpenSettings,
  onExportReport,
  copiedReport,
  mode
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">PromptCraft</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Bench & Diff
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Compare, diff, and score AI prompts side-by-side</p>
            </div>
          </div>

          {/* Mode Pill Mobile */}
          <div className="md:hidden">
            <button
              onClick={onOpenSettings}
              className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 border transition-all ${
                mode === 'live'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{mode === 'live' ? 'Live API' : 'Simulated'}</span>
            </button>
          </div>
        </div>

        {/* Center: Preset Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-start">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 w-full sm:w-auto">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-slate-400 font-medium shrink-0">Preset:</span>
            <select
              value={currentPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer w-full"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Mode pill desktop */}
          <button
            onClick={onOpenSettings}
            className={`hidden md:flex text-xs px-3 py-1.5 rounded-lg items-center gap-1.5 border font-medium transition-all hover:brightness-110 ${
              mode === 'live'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
            title="Configure Execution Engine"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{mode === 'live' ? 'Live Gemini Mode' : 'Fast Simulation Mode'}</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Export Benchmark Markdown"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Report Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Report</span>
              </>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
            title="Benchmark Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Global Run Benchmark button */}
          <button
            onClick={onRunBenchmark}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-500/25 border border-indigo-400/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Benchmark'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
