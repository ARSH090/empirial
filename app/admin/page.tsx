'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Trophy,
  Tag,
  Star,
  Sliders,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { MOCK_FIRMS } from '@/lib/data/firms-data';
import { MOCK_CHALLENGES } from '@/lib/data/challenges-data';
import { MOCK_DEALS } from '@/lib/data/deals-data';
import { MOCK_REVIEWS } from '@/lib/data/reviews-data';
import {
  getFirms,
  getChallenges,
  getDeals,
  getReviews,
  getLivePlatformStats,
} from '@/lib/firebase/services';

export default function AdminOverviewPage() {
  const [firms, setFirms] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState({
    activeTraders: 50000,
    verifiedFirms: 40,
    challenges: 150,
    reviews: 12000,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [firmsData, challData, dealData, revData, lStats] = await Promise.all([
          getFirms(),
          getChallenges(),
          getDeals(),
          getReviews(),
          getLivePlatformStats(),
        ]);
        setFirms(firmsData.length > 0 ? firmsData : MOCK_FIRMS);
        setChallenges(challData.length > 0 ? challData : MOCK_CHALLENGES);
        setDeals(dealData.length > 0 ? dealData : MOCK_DEALS);
        setReviews(revData.length > 0 ? revData : MOCK_REVIEWS);
        setLiveStats(lStats);
      } catch (err) {
        console.error('Failed to load admin overview metrics:', err);
        setFirms(MOCK_FIRMS);
        setChallenges(MOCK_CHALLENGES);
        setDeals(MOCK_DEALS);
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-foreground rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground font-mono">Loading metrics console...</p>
      </div>
    );
  }

  const stats = [
    { title: 'Prop Firms', count: firms.length, href: '/admin/firms', icon: Building2 },
    { title: 'Challenges Audited', count: challenges.length, href: '/admin/challenges', icon: Trophy },
    { title: 'Promo Coupons', count: deals.length, href: '/admin/deals', icon: Tag },
    { title: 'Trader Reviews', count: reviews.length, href: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 space-y-1">
        <h1 className="text-xl font-semibold sm:text-2xl bg-gradient-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
          Admin Control Center Overview
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Real-time platform metrics, page builder configurators, and content management systems.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              href={stat.href}
              className="bg-white dark:bg-card border border-zinc-200 dark:border-border hover:border-foreground rounded-2xl p-5 flex flex-col justify-between space-y-3 transition-all duration-200 hover:shadow-xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center border border-zinc-200/80 dark:border-zinc-700">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground block">{stat.title}</span>
                <div className="text-2xl font-black text-foreground mt-0.5 tracking-tight">
                  {stat.count}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Navigation Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Module 1: Home Page CMS */}
        <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Home Page CMS</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Edit Hero headline & CTAs, verified firms logo shape/size, 3 challenge plans, live dynamic stats, and curated trader testimonials.
            </p>
          </div>
          <Link
            href="/admin/page-builder"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Open Page Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Module 2: Prop Firms Directory */}
        <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Prop Firms Directory</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Manage firm logos, shape styles, allocation rules, coupon codes, platforms, and comparison specifications.
            </p>
          </div>
          <Link
            href="/admin/firms"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Manage Firms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Module 3: Evaluation Challenges & Reviews */}
        <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Challenges & Reviews</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Configure challenge models, profit targets, drawdown limits, prices, and moderate community reviews with stars.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/challenges"
              className="flex-1 py-2 px-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-card dark:text-foreground text-xs font-semibold text-center transition-colors"
            >
              Challenges
            </Link>
            <Link
              href="/admin/reviews"
              className="flex-1 py-2 px-3 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold text-center transition-colors shadow-xs"
            >
              Reviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
