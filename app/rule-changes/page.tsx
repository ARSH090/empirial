import React from 'react';
import { History, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Prop Firm Rule Changes & Updates Changelog | EMPIRIAL 2.0',
  description: 'Chronological timeline of prop firm rule modifications, drawdown adjustments, and payout policies.',
};

export default function RuleChangesPage() {
  const changelog = [
    {
      date: 'August 15, 2026',
      firm: 'Funding Pips',
      type: 'UPGRADE',
      title: 'Reduced Minimum Payout Window to 5 Trading Days',
      details: 'Funding Pips now allows all active funded traders on Master accounts to request profit splits every 5 calendar days with zero commission crypto withdrawals.',
    },
    {
      date: 'August 02, 2026',
      firm: 'The5ers',
      type: 'UPGRADE',
      title: '100% Profit Split Scaling Milestone Introduced',
      details: 'High Stakes traders now automatically upgrade to a 100% profit split once they achieve a cumulative 20% gain on their funded account.',
    },
    {
      date: 'July 24, 2026',
      firm: 'FTMO',
      type: 'UPDATE',
      title: 'Introduced DXtrade and cTrader Instant Portfolios',
      details: 'FTMO completed rollout of multi-platform integration supporting native TradingView charts on DXtrade and cTrader with zero overnight swap markups.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-white/10 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <History className="w-3.5 h-3.5" />
          <span>CHRONOLOGICAL AUDIT LOG</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Prop Firm Rule Changes Changelog
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Track official terms updates, payout frequency adjustments, and platform changes across the prop industry.
        </p>
      </div>

      <div className="space-y-6">
        {changelog.map((log, idx) => (
          <div
            key={idx}
            className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
                {log.firm}
              </span>
              <span className="text-xs text-slate-400 font-mono">{log.date}</span>
            </div>
            <h3 className="text-lg font-bold text-white">{log.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{log.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
