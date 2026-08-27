import React from 'react';
import { Shield, Sparkles, Trophy, Users, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About EMPIRIAL / ANURAJ FX Platform | Institutional Prop Intelligence',
  description: 'Learn about the mission, audit methodology, and executive leadership behind EMPIRIAL.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-white/10 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>OUR MISSION & INTEGRITY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About EMPIRIAL 2.0
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Pioneering forensic prop firm audits, real-time liquidity benchmarks, and transparent challenge evaluations for traders globally.
        </p>
      </div>

      <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
        <h2 className="text-xl font-bold text-white">Why EMPIRIAL Was Created</h2>
        <p>
          The proprietary trading firm industry has grown exponentially, but with this expansion came misleading marketing, hidden drawdown thresholds, and unpredictable payout denials.
        </p>
        <p>
          EMPIRIAL (engineered by <strong>ANURAJ FX</strong>) was founded to bring absolute forensic clarity to the market. We independently purchase, test, and audit evaluation challenges, calculate true effective spread costs, and verify real trader payment proofs through cryptographic hashes and verified receipts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-elevation-card border border-white/5 space-y-1 text-center">
            <div className="text-2xl font-mono font-black text-cyan-400">$15.2M+</div>
            <div className="text-xs text-slate-400">Payouts Audited</div>
          </div>
          <div className="p-4 rounded-2xl bg-elevation-card border border-white/5 space-y-1 text-center">
            <div className="text-2xl font-mono font-black text-emerald-400">520+</div>
            <div className="text-xs text-slate-400">Programs Evaluated</div>
          </div>
          <div className="p-4 rounded-2xl bg-elevation-card border border-white/5 space-y-1 text-center">
            <div className="text-2xl font-mono font-black text-amber-400">48,500+</div>
            <div className="text-xs text-slate-400">Trader Members</div>
          </div>
        </div>
      </div>
    </div>
  );
}
