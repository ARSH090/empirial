'use client';

import React, { useState } from 'react';
import { Radio, Plus, Trash2 } from 'lucide-react';
import { MOCK_TICKERS } from '@/lib/data/site-data';
import { MarketTicker } from '@/lib/types';

export default function AdminTickerPage() {
  const [tickers, setTickers] = useState<MarketTicker[]>(MOCK_TICKERS);

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white">Live Market Ticker Feeds</h1>
        <p className="text-xs text-slate-400">Configure continuous market liquidity quotes displayed in the global ticker ribbon.</p>
      </div>

      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-elevation-card text-slate-400 uppercase font-bold text-[10px]">
              <th className="p-4">Symbol</th>
              <th className="p-4">Live Price Quote</th>
              <th className="p-4">24h Change %</th>
              <th className="p-4 text-right">Trend Direction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200 font-mono">
            {tickers.map((t, idx) => (
              <tr key={idx} className="hover:bg-elevation-raised/60">
                <td className="p-4 font-bold text-white">{t.symbol}</td>
                <td className="p-4 text-cyan-400">{t.price}</td>
                <td className="p-4 font-bold" style={{ color: t.is_positive ? '#22C55E' : '#F43F5E' }}>
                  {t.change_24h}
                </td>
                <td className="p-4 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.is_positive ? 'bg-emerald-950/60 text-emerald-400' : 'bg-rose-950/60 text-rose-400'
                  }`}>
                    {t.is_positive ? 'Bullish' : 'Bearish'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
