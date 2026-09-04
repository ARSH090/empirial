'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  Calendar,
  Clock,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Firm, Challenge, Deal, Review, Payout } from '@/lib/types';
import { calculateFirmMetrics } from '@/lib/utils/rating-calculator';

// Platform Logo Dictionary from downloaded assets
const PLATFORM_DATA: Record<string, { name: string; logo: string; type: 'forex' | 'futures' }> = {
  mt5: { name: 'MetaTrader 5', logo: '/platforms/mt5.png', type: 'forex' },
  ctrader: { name: 'cTrader', logo: '/platforms/ctrader.svg', type: 'forex' },
  'match-trader': { name: 'Match-Trader', logo: '/platforms/match-trader.svg', type: 'forex' },
  tradelocker: { name: 'TradeLocker', logo: '/platforms/tradelocker.jpeg', type: 'forex' },
  ninjatrader: { name: 'NinjaTrader', logo: '/platforms/ninjatrader.svg', type: 'futures' },
  tradovate: { name: 'Tradovate', logo: '/platforms/tradovate.png', type: 'futures' },
  tradingview: { name: 'TradingView', logo: '/platforms/tradingview.png', type: 'futures' },
  bookmap: { name: 'Bookmap', logo: '/platforms/bookmap.jpeg', type: 'futures' },
  atas: { name: 'ATAS', logo: '/platforms/atas.jpeg', type: 'futures' },
  deepcharts: { name: 'Deepcharts', logo: '/platforms/deepcharts.jpeg', type: 'futures' },
  multicharts: { name: 'MultiCharts', logo: '/platforms/multicharts.svg', type: 'futures' },
};

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
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'offers' | 'reviews'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Genuine Synced Rating metrics calculations
  const metrics = calculateFirmMetrics(firm, firmReviews);
  const totalReviewsCount = metrics.reviewCount;
  const computedRating = metrics.rating;

  // Platforms lookup
  const platformKeys = (firm.platform_ids || []).filter((pid) => PLATFORM_DATA[pid]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          
          {/* Main Top Profile Banner (Strict RULE:BW Compliance) */}
          <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            
            {/* Top Identity Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Firm Brand & Basic Specs */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-2 overflow-hidden shadow-xs">
                  {firm.logo_url ? (
                    <img
                      src={firm.logo_url}
                      alt={firm.name}
                      className="h-12 w-auto max-w-[56px] object-contain rounded-md"
                    />
                  ) : (
                    <span className="font-black text-xl sm:text-2xl text-foreground">
                      {firm.name.substring(0, 3).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {firm.name}
                    </h1>
                    {firm.is_verified && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300/40 dark:border-emerald-600/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Audited
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                      <span>{computedRating.toFixed(1)}</span>
                      <span className="text-muted-foreground font-medium">({totalReviewsCount})</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                    {firm.description || 'Audited proprietary trading platform featuring institutional funding models.'}
                  </p>

                  {/* Platforms list with zoom hover */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                    <span className="text-muted-foreground font-semibold">Platforms:</span>
                    {platformKeys.length > 0 ? (
                      platformKeys.map((pid) => {
                        const p = PLATFORM_DATA[pid];
                        return (
                          <Tooltip key={pid}>
                            <TooltipTrigger asChild>
                              <motion.div
                                whileHover={{ scale: 1.25 }}
                                className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-0.5 cursor-pointer"
                              >
                                <img src={p.logo} alt={p.name} className="h-4 w-4 object-contain" />
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px] font-bold bg-black text-white dark:bg-white dark:text-black">
                              {p.name}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })
                    ) : (
                      <span className="font-bold text-foreground">{firm.platforms || 'MT5, cTrader'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                {/* Discount Code Button */}
                <button
                  type="button"
                  onClick={() => handleCopyCode(firm.coupon_code_custom || 'EMPIRE')}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{firm.discount_label_custom || '20% OFF'}</span>
                    </>
                  )}
                </button>

                {/* Compare Link */}
                <Link
                  href={`/compare?firms=${firm.slug}`}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-card dark:text-foreground dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
                >
                  <Layers className="w-4 h-4" />
                  <span>Compare</span>
                </Link>

                {/* Visit Official Site Button */}
                <a
                  href={firm.buy_url || 'https://discord.gg/ww4dkeeZdp'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>Visit Official Site</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 4 Main Image 1 Stat Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              {/* 1. Headquarters */}
              <div className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-3">
                <Globe className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                    HEADQUARTERS
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-foreground">
                    {firm.headquarters || 'Dubai, UAE'}
                  </span>
                </div>
              </div>

              {/* 2. Experience */}
              <div className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                    EXPERIENCE
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-foreground">
                    {firm.years_working || `Est. ${firm.founded_year || '2024'}`}
                  </span>
                </div>
              </div>

              {/* 3. Total Payouts */}
              <div className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-3">
                <DollarSign className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                    TOTAL PAYOUTS
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-foreground">
                    {firm.total_payouts || '$15,000,000+'}
                  </span>
                </div>
              </div>

              {/* 4. Avg Payout SLA */}
              <div className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                    AVG PAYOUT SLA
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-foreground">
                    {firm.avg_payout_time || '8-24 Hours'}
                  </span>
                </div>
              </div>
            </div>

            {/* Evaluation Models Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-muted-foreground font-semibold">Evaluation Models:</span>
                {(firm.models || ['1-Step Challenge', '2-Step Evaluation', 'Instant Model']).map((model) => (
                  <span
                    key={model}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 text-foreground border border-zinc-200 dark:border-zinc-800"
                  >
                    {model}
                  </span>
                ))}
              </div>

              <div className="text-xs text-muted-foreground font-medium">
                Max Allocation: <strong className="text-foreground font-bold">{firm.max_allocation}</strong> (Profit Split {firm.profit_split_custom})
              </div>
            </div>
          </div>

          {/* Sub-Navigation Tabs (Black & White Theme Tabs) */}
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Rules & Specs Overview' },
              { id: 'challenges', label: `Challenges (${firmChallenges.length})` },
              { id: 'offers', label: `Promo Deals (${firmDeals.length})` },
              { id: 'reviews', label: `Verified Reviews (${firmReviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-foreground dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rules & Policies Left Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Risk Policies */}
                <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-foreground font-bold text-base">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h2>Risk & Consistency Rules</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {firm.consistency_rules_content || 'No strict lot size consistency required. Hedging allowed across open accounts. Weekend holding permitted on Swing accounts.'}
                  </p>
                </div>

                {/* Drawdown Rules */}
                <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-foreground font-bold text-base">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <h2>Evaluation & Maximum Drawdown Rules</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {firm.firm_rules_content || 'Maximum daily drawdown calculated based on previous day balance or equity at 00:00 CE(S)T. Hard breach results in immediate account closure.'}
                  </p>
                </div>

                {/* Payout Schedule */}
                {firm.payout_programs && firm.payout_programs.length > 0 && (
                  <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 space-y-4 shadow-xs">
                    <h2 className="text-foreground font-bold text-base">Payout Tiers & Scaling Model</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-muted-foreground uppercase tracking-wider text-[10px] border-b border-zinc-200 dark:border-zinc-800 pb-2">
                            <th className="pb-2 font-bold">Model</th>
                            <th className="pb-2 font-bold">Payout Schedule</th>
                            <th className="pb-2 font-bold">Profit Split</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {firm.payout_programs.map((prog, idx) => (
                            <tr key={idx} className="text-foreground">
                              <td className="py-2.5 font-bold">{prog.name}</td>
                              <td className="py-2.5 font-mono text-muted-foreground">{prog.schedule}</td>
                              <td className="py-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{prog.split}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Restricted Countries */}
                <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <Globe className="w-4 h-4 text-rose-500" />
                    <h3>Restricted Jurisdictions</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Traders residing in the following jurisdictions are prohibited:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(firm.restricted_countries || ['US', 'IR', 'KP', 'SY', 'CU']).map((country) => (
                      <span
                        key={country}
                        className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Active Promo Deal */}
                {firmDeals.length > 0 && (
                  <div className="bg-white dark:bg-card border-2 border-black dark:border-white rounded-2xl p-6 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">ACTIVE PROMO</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">-{firmDeals[0].discount_pct}% OFF</span>
                    </div>
                    <h3 className="text-base font-bold text-foreground">{firmDeals[0].discount_label}</h3>
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-foreground">{firmDeals[0].code}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(firmDeals[0].code)}
                        className="px-3 py-1.5 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        {copiedCode ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Challenges */}
          {activeTab === 'challenges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {firmChallenges.map((ch) => (
                <div key={ch.id} className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 space-y-4 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                        ${(ch.account_size / 1000).toFixed(0)}K Account
                      </span>
                      <h3 className="text-lg font-extrabold text-foreground">{ch.name}</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 text-xs font-mono font-bold text-foreground border border-zinc-200 dark:border-zinc-800">
                      {ch.steps === 0 ? 'Instant' : `${ch.steps}-Step`}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                    <div className="border-r border-zinc-200 dark:border-zinc-800">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Profit Split</span>
                      <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{ch.profit_split_pct}%</span>
                    </div>
                    <div className="border-r border-zinc-200 dark:border-zinc-800">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Max Loss</span>
                      <span className="font-mono font-extrabold text-rose-500 text-sm">{ch.max_loss_limit_pct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Target</span>
                      <span className="font-mono font-extrabold text-foreground text-sm">{ch.profit_target_pct}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-foreground">${ch.price}</span>
                      {ch.original_price && ch.original_price > ch.price && (
                        <span className="text-xs text-muted-foreground line-through">${ch.original_price}</span>
                      )}
                    </div>
                    <a
                      href={ch.buy_url || firm.buy_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs transition-all cursor-pointer shadow-xs"
                    >
                      Buy Challenge
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Offers */}
          {activeTab === 'offers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {firmDeals.map((deal) => (
                <div key={deal.id} className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-extrabold text-foreground">{deal.discount_label}</h3>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-300/40">
                      -{deal.discount_pct}% OFF
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{deal.description}</p>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-foreground">{deal.code}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(deal.code)}
                      className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {firmReviews.map((rev) => (
                  <div key={rev.id} className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rev.overall_rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">{rev.created_at}</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{rev.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">"{rev.body}"</p>
                    <div className="text-xs text-muted-foreground font-medium pt-1">
                      By <strong className="text-foreground">{rev.full_name}</strong> {rev.is_verified_trader && <span className="text-emerald-600 dark:text-emerald-400 font-bold">(Verified Trader)</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </TooltipProvider>
  );
}
