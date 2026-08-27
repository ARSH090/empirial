'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  Star,
  Globe,
  Tag,
  Trophy,
  DollarSign,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { RatingBadge } from '@/components/ui/rating-badge';
import { CopyButton } from '@/components/ui/copy-button';
import { ProfitSplitGauge } from '@/components/ui/profit-split-gauge';
import { StrikePrice } from '@/components/ui/strike-price';
import { Firm, Challenge, Deal, Review, Payout } from '@/lib/types';

interface FirmProfileClientProps {
  firm: Firm;
  firmChallenges: Challenge[];
  firmDeals: Deal[];
  firmReviews: Review[];
  firmPayouts: Payout[];
}

export function FirmProfileClient({
  firm,
  firmChallenges,
  firmDeals,
  firmReviews,
  firmPayouts,
}: FirmProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'offers' | 'reviews' | 'payouts'>('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Identity Shell */}
      <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-elevation-card border-2 border-white/10 flex items-center justify-center font-black text-3xl text-cyan-400 shadow-xl">
              {firm.name.substring(0, 3).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {firm.name}
                </h1>
                {firm.is_verified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Audited
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                {firm.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                <span>HQ: <strong className="text-white">{firm.headquarters}</strong></span>
                <span>•</span>
                <span>Platforms: <strong className="text-white">{firm.platforms}</strong></span>
                <span>•</span>
                <span>Trust Score: <strong className="text-cyan-400">{firm.trust_score}/100</strong></span>
              </div>
            </div>
          </div>

          {/* Top CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <CopyButton
              textToCopy={firm.coupon_code_custom}
              label={firm.coupon_code_custom}
              size="md"
            />
            <Link
              href={`/compare?firms=${firm.slug}`}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-elevation-card hover:bg-elevation-overlay border border-white/10 text-white font-bold text-xs text-center transition-all"
            >
              Compare Specs
            </Link>
          </div>
        </div>

        {/* Highlight Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/5 text-center">
          <div className="p-3 rounded-xl bg-elevation-card border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Max Allocation</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">{firm.max_allocation}</div>
          </div>
          <div className="p-3 rounded-xl bg-elevation-card border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Profit Split</span>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">{firm.profit_split_custom}</div>
          </div>
          <div className="p-3 rounded-xl bg-elevation-card border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Payout Schedule</span>
            <div className="text-base font-bold text-slate-200 mt-0.5">{firm.payout_custom}</div>
          </div>
          <div className="p-3 rounded-xl bg-elevation-card border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Trader Rating</span>
            <div className="text-base font-bold text-amber-400 font-mono mt-0.5">{firm.rating} / 5.0 ★</div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Rules & Specs Overview' },
          { id: 'challenges', label: `Challenges (${firmChallenges.length})` },
          { id: 'offers', label: `Promo Deals (${firmDeals.length})` },
          { id: 'reviews', label: `Reviews & Ratings (${firmReviews.length})` },
          { id: 'payouts', label: `Payout Proofs (${firmPayouts.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left: Rules & Payout Policy */}
          <div className="lg:col-span-2 space-y-6">
            {/* Consistency Rules */}
            <div className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3>Consistency & Risk Policies</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {firm.consistency_rules_content || 'No strict lot size consistency required. Hedging allowed. Overnight holding allowed on swing accounts.'}
              </p>
            </div>

            {/* Firm General Rules */}
            <div className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h3>Evaluation & Drawdown Rules</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {firm.firm_rules_content || 'Daily loss calculated based on balance or equity, whichever is higher at 00:00 CE(S)T. Weekend holding permitted on Swing challenge types.'}
              </p>
            </div>

            {/* Payout Programs */}
            {firm.payout_programs && firm.payout_programs.length > 0 && (
              <div className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold text-base">Payout & Scaling Model</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10 pb-2">
                        <th className="pb-2 font-bold">Tier / Model</th>
                        <th className="pb-2 font-bold">Payout Schedule</th>
                        <th className="pb-2 font-bold">Profit Split</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {firm.payout_programs.map((prog, idx) => (
                        <tr key={idx} className="text-slate-200">
                          <td className="py-2.5 font-bold text-white">{prog.name}</td>
                          <td className="py-2.5 font-mono text-cyan-400">{prog.schedule}</td>
                          <td className="py-2.5 font-mono font-bold text-emerald-400">{prog.split}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Restricted Countries & Quick Actions */}
          <div className="space-y-6">
            {/* Restricted Countries */}
            <div className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Globe className="w-4 h-4 text-rose-400" />
                <h4>Restricted Jurisdictions</h4>
              </div>
              <p className="text-xs text-slate-400">
                Residents from the following countries are currently prohibited from purchasing evaluation challenges:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(firm.restricted_countries || ['US', 'IR', 'KP', 'SY', 'CU']).map((country) => (
                  <span
                    key={country}
                    className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Deal Card */}
            {firmDeals.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-950/40 to-elevation-surface border border-cyan-500/30 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">ACTIVE PROMO</span>
                  <span className="text-xs font-bold text-emerald-400">-{firmDeals[0].discount_pct}% OFF</span>
                </div>
                <h4 className="text-base font-bold text-white">{firmDeals[0].discount_label}</h4>
                <div className="p-2.5 rounded-xl bg-elevation-card border border-white/5 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{firmDeals[0].code}</span>
                  <CopyButton textToCopy={firmDeals[0].code} label="COPY" size="sm" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: Challenges */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firmChallenges.map((ch) => (
            <div key={ch.id} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-cyan-400">${(ch.account_size / 1000).toFixed(0)}K Account</span>
                  <h3 className="text-base font-bold text-white">{ch.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono font-bold text-slate-300">
                  {ch.steps === 0 ? 'Instant' : `${ch.steps}-Step`}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 rounded-xl bg-elevation-card border border-white/5 text-center items-center">
                <div className="border-r border-white/5">
                  <ProfitSplitGauge percentage={ch.profit_split_pct} size={40} />
                </div>
                <div className="border-r border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase">Max Loss</span>
                  <div className="font-mono font-bold text-rose-400 text-sm">{ch.max_loss_limit_pct}%</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Target</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm">{ch.profit_target_pct}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <StrikePrice price={ch.price} originalPrice={ch.original_price} size="md" />
                <a
                  href={ch.buy_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs"
                >
                  Buy Challenge
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Offers */}
      {activeTab === 'offers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {firmDeals.map((deal) => (
            <div key={deal.id} className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-cyan-400">{deal.discount_label}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  -{deal.discount_pct}% OFF
                </span>
              </div>
              <p className="text-xs text-slate-300">{deal.description}</p>
              <div className="p-3 rounded-xl bg-elevation-card border border-white/5 flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-cyan-400">{deal.code}</span>
                <CopyButton textToCopy={deal.code} label="COPY CODE" size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 4: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {firmReviews.map((rev) => (
              <div key={rev.id} className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.overall_rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{rev.created_at}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{rev.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">"{rev.body}"</p>
                <div className="text-xs font-bold text-slate-400">
                  By <strong className="text-white">{rev.full_name}</strong> {rev.is_verified_trader && <span className="text-emerald-400">(Verified Trader)</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 5: Payouts */}
      {activeTab === 'payouts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firmPayouts.map((pay) => (
            <div key={pay.id} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-400 font-mono">${pay.amount.toLocaleString()}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">{pay.payout_date}</span>
              </div>
              <div className="text-xs font-bold text-white">{pay.trader_display_name}</div>
              <p className="text-[11px] text-slate-400">{pay.concept} • {pay.account_size} Account • {pay.payout_method}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
