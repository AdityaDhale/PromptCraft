import React from 'react';
import { Award, Zap, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export function Scorecard({ comparison, scoresA, scoresB, variantAName, variantBName }) {
  if (!scoresA || !scoresB) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-xs">
        Run benchmark to generate automated quality scorecards.
      </div>
    );
  }

  const isWinnerA = comparison?.winner === 'variantA';
  const isWinnerB = comparison?.winner === 'variantB';
  const isTie = comparison?.winner === 'tie';

  const metrics = [
    {
      name: 'Clarity & Structure',
      description: 'Readability, paragraph pacing, and markdown hierarchy',
      scoreA: scoresA.clarity,
      scoreB: scoresB.clarity
    },
    {
      name: 'Conciseness & Density',
      description: 'Token efficiency, absence of filler fluff, and high signal-to-noise ratio',
      scoreA: scoresA.conciseness,
      scoreB: scoresB.conciseness
    },
    {
      name: 'Instruction Adherence',
      description: 'Strict fulfillment of requested constraints, SLAs, bullets, or syntax',
      scoreA: scoresA.adherence,
      scoreB: scoresB.adherence
    }
  ];

  return (
    <div className="p-5 overflow-auto">
      {/* Winner Banner */}
      <div className="mb-6 p-4 rounded-xl border bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-indigo-950/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/30 shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Benchmark Winner
              </span>
              <span className="text-xs text-slate-400">●</span>
              <span className="text-xs font-semibold text-white">
                {isTie ? 'Statistically Even Match' : isWinnerB ? `${variantBName || 'Variant B'}` : `${variantAName || 'Variant A'}`}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              {comparison?.summary}
            </p>
          </div>
        </div>

        {/* Delta Chip */}
        {!isTie && (
          <div className="bg-indigo-500/20 border border-indigo-500/40 px-3 py-1.5 rounded-lg text-right shrink-0">
            <div className="text-[10px] font-mono text-indigo-300 uppercase">Margin</div>
            <div className="text-base font-bold text-white font-mono">+{comparison?.diffScore} pts</div>
          </div>
        )}
      </div>

      {/* Comparative Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Card A */}
        <div className={`p-4 rounded-xl border transition-all ${
          isWinnerA 
            ? 'bg-slate-900/90 border-amber-500/40 ring-1 ring-amber-500/20' 
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-semibold text-slate-300">{variantAName || 'Variant A'}</span>
              <span className="text-[11px] font-mono text-slate-500 block">Baseline Prompt</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-200">
              {scoresA.composite}
              <span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-slate-400" /> Key Observations:
            </div>
            {scoresA.insights.map((note, idx) => (
              <div key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                <span className="text-slate-600 mt-0.5">•</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card B */}
        <div className={`p-4 rounded-xl border transition-all ${
          isWinnerB 
            ? 'bg-slate-900/90 border-indigo-500/50 ring-1 ring-indigo-500/30' 
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
                {variantBName || 'Variant B'}
                {isWinnerB && (
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-1.5 py-0.2 rounded font-mono">
                    WINNER
                  </span>
                )}
              </span>
              <span className="text-[11px] font-mono text-indigo-400/80 block">Structured Candidate</span>
            </div>
            <div className="text-2xl font-bold font-mono text-indigo-300">
              {scoresB.composite}
              <span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
            <div className="text-[11px] font-mono text-indigo-300/80 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Key Observations:
            </div>
            {scoresB.insights.map((note, idx) => (
              <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Criteria Progress Bars */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Comparative Evaluation Matrix
        </h4>

        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1.5 pb-3 border-b border-slate-800/60 last:border-0 last:pb-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-200">{m.name}</span>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span className="text-slate-400">A: <strong className="text-slate-200">{m.scoreA}</strong></span>
                <span className="text-indigo-400">B: <strong className="text-indigo-300">{m.scoreB}</strong></span>
              </div>
            </div>

            {/* Dual Bars */}
            <div className="grid grid-cols-2 gap-2">
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-500 rounded-full transition-all duration-500"
                  style={{ width: `${m.scoreA}%` }}
                />
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500 shadow-sm shadow-indigo-500/50"
                  style={{ width: `${m.scoreB}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">{m.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
