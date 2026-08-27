'use client';

import React, { useState } from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';
import { MOCK_SPREADS } from '@/lib/data/spreads-data';

export function SpreadsClient() {
  const [selectedPair, setSelectedPair] = useState<string>('all');

  const filteredSpreads = MOCK_SPREADS.filter((s) => {
    if (selectedPair !== 'all' && s.pair !== selectedPair) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>LIVE LIQUIDITY & EXECUTION BENCHMARKS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Live Broker Spreads & Execution Matrix
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Forensic bid/ask spread monitoring across major forex pairs, metals (XAUUSD), and crypto with exact commission calculations per standard lot.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'EURUSD', 'GBPUSD', 'XAUUSD', 'BTCUSD', 'US30'].map((pair) => (
          <button
            key={pair}
            onClick={() => setSelectedPair(pair)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedPair === pair
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-elevation-surface hover:bg-elevation-raised text-slate-300 border border-white/5'
            }`}
          >
            {pair === 'all' ? 'All Instruments' : pair}
          </button>
        ))}
      </div>

      {/* Spreads Table */}
      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-elevation-card/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Broker / Liquidity Feed</th>
                <th className="p-4">Symbol / Pair</th>
                <th className="p-4">Raw Spread (Pips)</th>
                <th className="p-4">Commission ($/Lot)</th>
                <th className="p-4">Effective Cost per Lot</th>
                <th className="p-4">Account Type</th>
                <th className="p-4">Platform</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredSpreads.map((spread) => {
                const effectiveCost = (spread.spread_pips * 10) + spread.commission_per_lot;

                return (
                  <tr key={spread.id} className="hover:bg-elevation-raised/60 transition-colors">
                    <td className="p-4 font-bold text-white whitespace-nowrap">
                      {spread.broker_name}
                    </td>
                    <td className="p-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {spread.pair}
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {spread.spread_pips} pips
                    </td>
                    <td className="p-4 font-mono text-slate-300 whitespace-nowrap">
                      ${spread.commission_per_lot.toFixed(2)}
                    </td>
                    <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                      ${effectiveCost.toFixed(2)} / lot
                    </td>
                    <td className="p-4 text-slate-300 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
                        {spread.account_type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {spread.platform}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Live Feed
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
