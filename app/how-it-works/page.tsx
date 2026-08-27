import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Trophy, DollarSign, Layers } from 'lucide-react';

export const metadata = {
  title: 'How Prop Firm Evaluations Work | 3-Step Guide | EMPIRIAL 2.0',
  description: 'A step-by-step roadmap from purchasing a challenge, passing evaluation targets, to receiving bi-weekly profit splits.',
};

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-white/10 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>3-STEP TRADER ROADMAP</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How Prop Trading Evaluations Work
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          From auditioning on simulated demo capital to trading up to $4,000,000 in funded allocation and receiving real profit splits.
        </p>
      </div>

      <div className="space-y-8">
        {[
          {
            step: '01',
            title: 'Choose & Purchase an Evaluation Challenge',
            desc: 'Use the EMPIRIAL 13-column matrix to select an account tier ($5K to $500K), steps (1-step, 2-step, or instant funding), and apply verified discount codes to save up to 80%.',
          },
          {
            step: '02',
            title: 'Hit the Profit Target Without Breaching Loss Limits',
            desc: 'Trade simulated markets on cTrader, MT5, or Tradovate. Target an 8% to 10% gain in Phase 1 while strictly preserving the 5% daily drawdown and 10% maximum loss ceiling.',
          },
          {
            step: '03',
            title: 'Receive Funded Account & Bi-Weekly Profit Splits',
            desc: 'Once verified, sign your trader contract and keep 80% to 100% of all profits. Receive fast payouts via Crypto (USDT/USDC), Rise, or direct bank transfer with your initial challenge fee refunded.',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 shadow-xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-black text-2xl flex items-center justify-center shrink-0">
              {item.step}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-sm shadow-xl active:scale-95 transition-all"
        >
          <span>Find Your Next Challenge Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
