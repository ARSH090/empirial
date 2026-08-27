import React from 'react';
import Link from 'next/link';
import { PlayCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { MOCK_FIRMS } from '@/lib/data/firms-data';

export const metadata = {
  title: 'Free Prop Firm Demo Accounts & Practice Trials | EMPIRIAL 2.0',
  description: 'Practice trading on simulated evaluation accounts with 14-day free trials before purchasing a challenge.',
};

export default function DemoAccountsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-white/10 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <PlayCircle className="w-3.5 h-3.5" />
          <span>ZERO-RISK PRACTICE COMBINES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Free Practice Demo Accounts
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Test your strategy and execution under live market conditions using free 14-day evaluation trials before committing capital.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_FIRMS.slice(0, 4).map((firm) => (
          <div
            key={firm.id}
            className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{firm.name} Free Trial</h3>
                <span className="text-xs text-cyan-400 font-semibold">{firm.platforms}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                100% Free
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Experience the exact liquidity feed, drawdown metrics, and dashboard analytics used by funded {firm.name} traders.
            </p>

            <a
              href={`https://${firm.slug}.com?demo=true&ref=empirial`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <span>Launch Free Trial Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
