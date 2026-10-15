import React, { useState } from 'react';
import { Copy, Check, Hash, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { estimateTokens } from '../services/evaluator';

export function PromptEditor({
  variantA,
  variantB,
  onChangeVariantA,
  onChangeVariantB,
  onResetPrompts
}) {
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  const tokensA = estimateTokens(variantA.prompt);
  const tokensB = estimateTokens(variantB.prompt);

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Variant A Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm transition-all focus-within:border-slate-700">
        {/* Card Header */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span className="text-xs font-semibold text-slate-200 tracking-wide">
              {variantA.name || 'Prompt Variant A'}
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              Baseline
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded">
              <Hash className="w-3 h-3 text-slate-500" />
              <span>~{tokensA} tokens</span>
            </div>
            <button
              onClick={() => copyToClipboard(variantA.prompt, setCopiedA)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Copy Prompt A"
            >
              {copiedA ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-3 flex-1 flex flex-col">
          <textarea
            value={variantA.prompt}
            onChange={(e) => onChangeVariantA(e.target.value)}
            placeholder="Enter Prompt Variant A... Use {{input}} for dynamic scenario variables"
            className="w-full h-44 bg-slate-950/50 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-800/80 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none resize-none leading-relaxed transition-all"
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              Variable: <code className="text-indigo-400 bg-indigo-500/10 px-1 rounded">{'{{input}}'}</code>
              {variantA.prompt.includes('{{input}}') ? (
                <span className="text-emerald-400 text-[10px] ml-1">● linked</span>
              ) : (
                <span className="text-amber-400/80 text-[10px] ml-1">● appended</span>
              )}
            </span>
            <span>{variantA.prompt.length} chars</span>
          </div>
        </div>
      </div>

      {/* Variant B Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm transition-all focus-within:border-indigo-500/50">
        {/* Card Header */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-white tracking-wide">
              {variantB.name || 'Prompt Variant B'}
            </span>
            <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Candidate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-mono text-indigo-300/80 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/50">
              <Hash className="w-3 h-3 text-indigo-400" />
              <span>~{tokensB} tokens</span>
            </div>
            <button
              onClick={() => copyToClipboard(variantB.prompt, setCopiedB)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Copy Prompt B"
            >
              {copiedB ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-3 flex-1 flex flex-col">
          <textarea
            value={variantB.prompt}
            onChange={(e) => onChangeVariantB(e.target.value)}
            placeholder="Enter Prompt Variant B... Use {{input}} for dynamic scenario variables"
            className="w-full h-44 bg-slate-950/50 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none resize-none leading-relaxed transition-all"
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              Variable: <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">{'{{input}}'}</code>
              {variantB.prompt.includes('{{input}}') ? (
                <span className="text-emerald-400 text-[10px] ml-1">● linked</span>
              ) : (
                <span className="text-amber-400/80 text-[10px] ml-1">● appended</span>
              )}
            </span>
            <span>{variantB.prompt.length} chars</span>
          </div>
        </div>
      </div>
    </div>
  );
}
