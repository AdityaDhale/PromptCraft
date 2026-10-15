import React, { useState } from 'react';
import { X, Key, Cpu, ShieldCheck, ExternalLink, Zap } from 'lucide-react';

export function SettingsModal({
  isOpen,
  onClose,
  mode,
  apiKey,
  onSaveSettings
}) {
  const [selectedMode, setSelectedMode] = useState(mode);
  const [keyInput, setKeyInput] = useState(apiKey);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      mode: selectedMode,
      apiKey: keyInput.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Execution Engine Settings</h3>
            <p className="text-xs text-slate-400">Configure how PromptCraft executes benchmark runs</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Engine Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Execution Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {/* Simulation Mode */}
              <button
                type="button"
                onClick={() => setSelectedMode('simulated')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedMode === 'simulated'
                    ? 'bg-indigo-600/15 border-indigo-500 ring-1 ring-indigo-500 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Fast Simulation</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Zero setup, offline deterministic responses. Perfect for fast testing and video screen recording.
                </p>
              </button>

              {/* Live Gemini API Mode */}
              <button
                type="button"
                onClick={() => setSelectedMode('live')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedMode === 'live'
                    ? 'bg-emerald-600/15 border-emerald-500 ring-1 ring-emerald-500 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>Live Gemini API</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Executes live model inference via Google Gemini 1.5 Flash using your API key.
                </p>
              </button>
            </div>
          </div>

          {/* API Key Input (if live) */}
          {selectedMode === 'live' && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Google Gemini API Key</label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Keys are stored strictly in browser localStorage and never logged or proxied.</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
