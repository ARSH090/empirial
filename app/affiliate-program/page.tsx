import React from 'react';
import { Sparkles, DollarSign, Users, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Affiliate Referral Partner Program (15% Tier) | EMPIRIAL 2.0',
  description: 'Earn 15% recurring affiliate commissions on all challenge purchases and membership upgrades referred through your link.',
};

export default function AffiliateProgramPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-white/10 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EARN RECURRING COMMISSIONS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          EMPIRIAL Affiliate Partner Program
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Partner with the #1 prop firm intelligence network. Earn generous commissions while providing your community with audited discount coupons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 text-center space-y-2">
          <div className="text-3xl font-mono font-black text-cyan-400">15%</div>
          <h3 className="text-sm font-bold text-white">Direct Commission Tier</h3>
          <p className="text-xs text-slate-400">On all challenge referrals and pro subscription upgrades.</p>
        </div>
        <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 text-center space-y-2">
          <div className="text-3xl font-mono font-black text-emerald-400">60 Days</div>
          <h3 className="text-sm font-bold text-white">Attribution Cookie Window</h3>
          <p className="text-xs text-slate-400">Long-term tracking ensures you never miss a commission.</p>
        </div>
        <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 text-center space-y-2">
          <div className="text-3xl font-mono font-black text-amber-400">Instant</div>
          <h3 className="text-sm font-bold text-white">Monthly Crypto / Bank Payouts</h3>
          <p className="text-xs text-slate-400">Automatic monthly settlement via USDT, USDC, or Wire.</p>
        </div>
      </div>
    </div>
  );
}
