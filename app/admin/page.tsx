'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Trophy,
  Tag,
  Star,
  MessageSquare,
} from 'lucide-react';
import { MOCK_FIRMS } from '@/lib/data/firms-data';
import { MOCK_CHALLENGES } from '@/lib/data/challenges-data';
import { MOCK_DEALS } from '@/lib/data/deals-data';
import { MOCK_REVIEWS } from '@/lib/data/reviews-data';
import { getFirms, getChallenges, getDeals, getReviews } from '@/lib/firebase/services';

export default function AdminOverviewPage() {
  const [firms, setFirms] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [firmsData, challData, dealData, revData] = await Promise.all([
          getFirms(),
          getChallenges(),
          getDeals(),
          getReviews()
        ]);
        setFirms(firmsData.length > 0 ? firmsData : MOCK_FIRMS);
        setChallenges(challData.length > 0 ? challData : MOCK_CHALLENGES);
        setDeals(dealData.length > 0 ? dealData : MOCK_DEALS);
        setReviews(revData.length > 0 ? revData : MOCK_REVIEWS);
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
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading metrics console...</p>
      </div>
    );
  }

  const stats = [
    { title: 'Prop Firms', count: firms.length, href: '/admin/firms', icon: Building2, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { title: 'Challenges Audited', count: challenges.length, href: '/admin/challenges', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'Active Coupons', count: deals.length, href: '/admin/deals', icon: Tag, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Trader Reviews', count: reviews.length, href: '/admin/reviews', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Admin Control Center Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Real-time platform metrics, moderation queues, and content management tools.
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
              className="bg-elevation-surface border border-white/10 hover:border-purple-500/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all hover:shadow-xl group"
            >
              <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">{stat.title}</span>
                <div className="text-xl font-mono font-black text-white mt-0.5 group-hover:text-purple-300">
                  {stat.count}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Control Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Firms & Challenges */}
        <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Prop Firms & Challenge Management</span>
            </h2>
            <Link href="/admin/firms" className="text-xs font-bold text-purple-400 hover:text-purple-300">
              Manage All →
            </Link>
          </div>
          <div className="space-y-2">
            {firms.slice(0, 4).map(f => (
              <div key={f.id} className="flex justify-between items-center p-3 rounded-xl bg-elevation-card border border-white/5 text-xs">
                <span className="font-bold text-white">{f.name}</span>
                <span className="font-mono text-emerald-400">{f.profit_split_custom}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module 2: Trader Reviews Moderation */}
        <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Recent Trader Reviews</span>
            </h2>
            <Link href="/admin/reviews" className="text-xs font-bold text-purple-400 hover:text-purple-300">
              Moderation Queue →
            </Link>
          </div>
          <div className="space-y-2">
            {reviews.slice(0, 4).map(r => (
              <div key={r.id} className="flex justify-between items-center p-3 rounded-xl bg-elevation-card border border-white/5 text-xs">
                <span className="text-white font-semibold">{r.user_name} ({r.firm_name})</span>
                <span className="font-mono font-bold text-amber-400">{r.overall_rating} ★</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
