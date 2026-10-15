import React, { useState } from 'react';
import { Columns, GitCompare, BarChart3, Copy, Check, Clock, Hash, Play, Sparkles } from 'lucide-react';
import { DiffViewer } from './DiffViewer';
import { Scorecard } from './Scorecard';

export function ResultsDeck({
  isRunning,
  result,
  diffData,
  comparison,
  variantAName,
  variantBName,
  onRunBenchmark
}) {
  const [activeTab, setActiveTab] = useState('sideBySide'); // 'sideBySide', 'diff', 'scores'
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
      {/* Deck Tabs */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('sideBySide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'sideBySide'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-indigo-400" />
            <span>Side-by-Side</span>
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'diff'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Visual Diff</span>
            {diffData && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-300">
                +{diffData.stats.added} / -{diffData.stats.removed}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'scores'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Scorecard</span>
            {comparison && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 uppercase">
                {comparison.winner}
              </span>
            )}
          </button>
        </div>

        {/* Global status or winner pill */}
        {result && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Latency: {result.variantA.latencyMs}ms / {result.variantB.latencyMs}ms</span>
          </div>
        )}
      </div>

      {/* Main Display Area */}
      <div className="min-h-[380px] flex flex-col">
        {isRunning ? (
          /* Loading Animation */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
              <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Running Dual Benchmark...</h4>
            <p className="text-xs text-slate-400 font-mono">
              Evaluating instruction constraints, computing token diffs, and calculating metrics
            </p>
          </div>
        ) : !result ? (
          /* Empty Initial State */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
              <Play className="w-6 h-6 text-indigo-400 ml-0.5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Ready for Benchmark</h4>
            <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
              Click the <strong className="text-indigo-400">Run Benchmark</strong> button or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Ctrl+Enter</kbd> to execute both prompt variants side-by-side.
            </p>
            <button
              onClick={onRunBenchmark}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Benchmark Now</span>
            </button>
          </div>
        ) : (
          /* Tab Contents */
          <>
            {activeTab === 'sideBySide' && (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 flex-1">
                {/* Output A */}
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-300">{variantAName || 'Variant A'}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
                          Score: {result.variantA.scores.composite}/100
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {result.variantA.latencyMs}ms
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Hash className="w-3 h-3 text-slate-500" />
                          {result.variantA.tokens}t
                        </span>
                        <button
                          onClick={() => copyToClipboard(result.variantA.output, setCopiedA)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                          title="Copy Output"
                        >
                          {copiedA ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap select-text">
                      {result.variantA.output}
                    </div>
                  </div>
                </div>

                {/* Output B */}
                <div className="p-4 flex flex-col justify-between bg-indigo-950/10">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-indigo-300">{variantBName || 'Variant B'}</span>
                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30">
                          Score: {result.variantB.scores.composite}/100
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          {result.variantB.latencyMs}ms
                        </span>
                        <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1">
                          <Hash className="w-3 h-3 text-indigo-400" />
                          {result.variantB.tokens}t
                        </span>
                        <button
                          onClick={() => copyToClipboard(result.variantB.output, setCopiedB)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                          title="Copy Output"
                        >
                          {copiedB ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap select-text">
                      {result.variantB.output}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'diff' && (
              <DiffViewer
                diffData={diffData}
                outputA={result.variantA.output}
                outputB={result.variantB.output}
              />
            )}

            {activeTab === 'scores' && (
              <Scorecard
                comparison={comparison}
                scoresA={result.variantA.scores}
                scoresB={result.variantB.scores}
                variantAName={variantAName}
                variantBName={variantBName}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
