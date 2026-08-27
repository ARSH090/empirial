import React from 'react';
import Link from 'next/link';
import { ShieldAlert, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Prop Firm Evaluation Rules & Drawdown Models Guide | EMPIRIAL 2.0',
  description: 'Learn the differences between balance-based vs equity-based drawdown, consistency rules, news restrictions, and weekend holding rules.',
};

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-white/10 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>PROP TRADING COMPLIANCE GUIDE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Prop Firm Rules & Drawdown Models
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Understand the mathematical drawdown calculations and risk restrictions before purchasing an evaluation challenge.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-white">1. Balance-Based vs Equity-Based (Trailing) Drawdown</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-cyan-400">Balance-Based Drawdown:</strong> The daily and maximum loss limit is anchored strictly to your closed cash balance at the start of the trading day (e.g. 00:00 CE(S)T). Open floating profits do not pull your daily loss threshold upwards.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-rose-400">Equity-Based (Trailing) Drawdown:</strong> The loss limit trails your highest unrealized equity in real time. If your account runs up +$3,000 in floating profit, your drawdown floor moves up by $3,000 immediately.
          </p>
        </div>

        <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-white">2. News Trading & High-Impact Releases</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Many prop firms prohibit executing trades within a <strong>2 to 5-minute window</strong> before and after red-folder macroeconomic releases (e.g. Non-Farm Payrolls, CPI, FOMC Interest Rate Decisions).
          </p>
        </div>

        <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-white">3. Consistency & Lot Size Variance</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Some firms enforce maximum lot size multipliers (e.g., no single trade can exceed 2x your average lot size) and single-day profit caps (e.g. no single day can represent more than 30% of total payout profit).
          </p>
        </div>
      </div>
    </div>
  );
}
