import React, { useState } from 'react';
import { Columns, AlignLeft, Info } from 'lucide-react';

export function DiffViewer({ diffData, outputA, outputB }) {
  const [viewMode, setViewMode] = useState('unified'); // 'unified' or 'split'

  if (!diffData || !diffData.diff) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-xs">
        Run benchmark to generate visual diff output.
      </div>
    );
  }

  const { diff, stats } = diffData;

  return (
    <div className="flex flex-col h-full">
      {/* Diff Toolbar */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Diff Stats */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            <strong>+{stats.added}</strong> additions
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
            <strong>-{stats.removed}</strong> deletions
          </span>
          <span className="text-slate-400">
            Similarity: <strong className="text-slate-200">{stats.similarity}%</strong>
          </span>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setViewMode('unified')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
              viewMode === 'unified'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Unified Diff</span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>
        </div>
      </div>

      {/* Diff Content */}
      <div className="p-4 flex-1 overflow-auto bg-slate-950/40">
        {viewMode === 'unified' ? (
          /* Unified Stream */
          <div className="font-mono text-xs leading-relaxed text-slate-200 whitespace-pre-wrap select-text p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            {diff.map((part, idx) => {
              if (part.type === 'added') {
                return (
                  <span
                    key={idx}
                    className="bg-emerald-500/20 text-emerald-300 font-medium border-b-2 border-emerald-500/60 px-0.5 rounded-sm mx-0.5"
                    title="Present only in Variant B"
                  >
                    {part.value}
                  </span>
                );
              }
              if (part.type === 'removed') {
                return (
                  <span
                    key={idx}
                    className="bg-rose-500/20 text-rose-300 line-through opacity-85 border-b-2 border-rose-500/60 px-0.5 rounded-sm mx-0.5"
                    title="Present only in Variant A"
                  >
                    {part.value}
                  </span>
                );
              }
              return <span key={idx}>{part.value}</span>;
            })}
          </div>
        ) : (
          /* Split View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
            {/* Left: Deletions/Variant A emphasis */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 overflow-auto">
              <div className="text-[11px] font-mono font-semibold text-rose-400 mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>Variant A (Deletions Highlighted)</span>
                <span>-{stats.removed} tokens</span>
              </div>
              <div className="font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                {diff.map((part, idx) => {
                  if (part.type === 'removed') {
                    return (
                      <span key={idx} className="bg-rose-500/25 text-rose-300 px-0.5 rounded line-through">
                        {part.value}
                      </span>
                    );
                  }
                  if (part.type === 'common') {
                    return <span key={idx}>{part.value}</span>;
                  }
                  return null; // Don't show additions in left column
                })}
              </div>
            </div>

            {/* Right: Additions/Variant B emphasis */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 overflow-auto">
              <div className="text-[11px] font-mono font-semibold text-emerald-400 mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>Variant B (Additions Highlighted)</span>
                <span>+{stats.added} tokens</span>
              </div>
              <div className="font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                {diff.map((part, idx) => {
                  if (part.type === 'added') {
                    return (
                      <span key={idx} className="bg-emerald-500/25 text-emerald-300 font-medium px-0.5 rounded">
                        {part.value}
                      </span>
                    );
                  }
                  if (part.type === 'common') {
                    return <span key={idx}>{part.value}</span>;
                  }
                  return null; // Don't show deletions in right column
                })}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/40 border border-rose-500/60 inline-block"></span>
            <span>Removed from Variant A</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-500/60 inline-block"></span>
            <span>Added in Candidate B</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-700 inline-block"></span>
            <span>Identical text</span>
          </span>
        </div>
      </div>
    </div>
  );
}
