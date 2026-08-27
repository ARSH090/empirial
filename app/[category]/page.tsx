'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Trophy, Tag, Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { MOCK_FIRMS } from '@/lib/data/firms-data';
import { MOCK_CHALLENGES } from '@/lib/data/challenges-data';
import { MOCK_DEALS } from '@/lib/data/deals-data';
import { ProfitSplitGauge } from '@/components/ui/profit-split-gauge';
import { StrikePrice } from '@/components/ui/strike-price';
import { CopyButton } from '@/components/ui/copy-button';

export default function CategoryLandingPage() {
  const params = useParams();
  const category = (params?.category as string) || 'forex';

  const categoryTitles: { [key: string]: { title: string; subtitle: string } } = {
    forex: {
      title: 'Forex Prop Trading Intelligence',
      subtitle: 'Audited forex evaluations from FTMO, The5ers, Funding Pips with raw cTrader and MT5 execution.',
    },
    futures: {
      title: 'Futures Prop Trading & Combines',
      subtitle: 'Top CME & CBOT exchange execution from Topstep, Apex Trader Funding with daily payouts.',
    },
    crypto: {
      title: 'Crypto Prop Challenges',
      subtitle: '24/7 weekend crypto prop trading evaluations across Bitcoin, Ethereum, and altcoin futures.',
    },
    'instant-funding': {
      title: 'Instant Funding Prop Programs (No Evaluation)',
      subtitle: 'Immediate live funded accounts with no challenge steps, scaling plans up to $4M, and bi-weekly payouts.',
    },
  };

  const currentInfo = categoryTitles[category] || {
    title: `${category.toUpperCase()} Prop Intelligence`,
    subtitle: 'Comprehensive audited prop firms, challenges, and exclusive promo codes.',
  };

  const filteredChallenges = MOCK_CHALLENGES.filter(c => c.category === category || category === 'all');
  const filteredDeals = MOCK_DEALS.filter(d => d.category === category || category === 'all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Category Hero */}
      <div className="border-b border-white/10 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5" />
          <span>{category.toUpperCase()} PROP SECTOR</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {currentInfo.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          {currentInfo.subtitle}
        </p>

        {/* Quick Nav Category Hubs */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href={`/${category}/challenges`}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold"
          >
            {category.toUpperCase()} Challenges Table
          </Link>
          <Link
            href={`/${category}/deals`}
            className="px-4 py-2 rounded-xl bg-elevation-card hover:bg-elevation-overlay border border-white/10 text-white text-xs font-bold"
          >
            {category.toUpperCase()} Discount Codes
          </Link>
        </div>
      </div>

      {/* Challenges Matrix */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Top Audited {category.toUpperCase()} Challenges</h2>
          <Link href={`/${category}/challenges`} className="text-xs text-cyan-400 font-bold flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.slice(0, 6).map((ch) => (
            <div key={ch.id} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-cyan-400">{ch.firm_name}</span>
                  <h3 className="text-sm font-bold text-white leading-snug">{ch.name}</h3>
                </div>
                <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10">
                  ${(ch.account_size / 1000).toFixed(0)}k
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-elevation-card border border-white/5 text-center items-center">
                <ProfitSplitGauge percentage={ch.profit_split_pct} size={38} />
                <div>
                  <span className="text-[9px] text-slate-400 uppercase">Max Loss</span>
                  <div className="font-mono font-bold text-rose-400 text-xs">{ch.max_loss_limit_pct}%</div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase">Target</span>
                  <div className="font-mono font-bold text-emerald-400 text-xs">{ch.profit_target_pct}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <StrikePrice price={ch.price} originalPrice={ch.original_price} size="sm" />
                <a
                  href={ch.buy_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-black font-bold text-xs"
                >
                  Buy Challenge
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Matrix */}
      {filteredDeals.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Active {category.toUpperCase()} Promo Coupons</h2>
            <Link href={`/${category}/deals`} className="text-xs text-cyan-400 font-bold flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-cyan-400">{deal.firm_name}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    -{deal.discount_pct}% OFF
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{deal.discount_label}</h3>
                <div className="p-2.5 rounded-xl bg-elevation-card border border-white/5 flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-cyan-400">{deal.code}</span>
                  <CopyButton textToCopy={deal.code} label="COPY" size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
