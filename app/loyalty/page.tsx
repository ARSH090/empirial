'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, CheckCircle2, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { MOCK_REWARDS } from '@/lib/data/loyalty-data';
import { LoyaltyReward } from '@/lib/types';
import { getStoredUser, openAuthModal } from '@/lib/utils/auth-store';
import { getLoyaltyRewards } from '@/lib/firebase/services';

export default function LoyaltyPage() {
  const [points, setPoints] = useState(3450);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [rewardsList, setRewardsList] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRewards() {
      try {
        const data = await getLoyaltyRewards();
        if (data && data.length > 0) {
          setRewardsList(data);
        } else {
          setRewardsList(MOCK_REWARDS);
        }
      } catch (err) {
        console.error('Failed to load loyalty rewards:', err);
        setRewardsList(MOCK_REWARDS);
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, []);

  const handleClaim = (reward: LoyaltyReward) => {
    const user = getStoredUser();
    if (!user) {
      openAuthModal();
      return;
    }
    if (points < reward.points_cost) {
      alert(`You need ${reward.points_cost - points} more points to claim this reward!`);
      return;
    }
    setPoints(points - reward.points_cost);
    setClaimedRewards([...claimedRewards, reward.id]);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4 min-h-screen flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading rewards catalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Balance Dashboard */}
      <div className="bg-gradient-to-r from-amber-950/40 via-elevation-surface to-elevation-surface border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Gift className="w-3.5 h-3.5" />
              <span>TRADER LOYALTY & REWARDS PROGRAM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Earn Points, Claim Free Challenges & Gear
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Earn loyalty points by auditing payouts, submitting verified reviews, and engaging with the trader community.
            </p>
          </div>

          {/* Points Counter Box */}
          <div className="p-6 rounded-2xl bg-elevation-card border border-amber-500/30 text-center shrink-0 w-full md:w-auto shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Your Points Balance
            </span>
            <div className="text-4xl font-mono font-black text-amber-400 mt-1">
              {points.toLocaleString()} <span className="text-xs text-slate-400 font-sans">pts</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gold Tier Trader</span>
            </span>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="pt-8 border-t border-white/5 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Tier Progress: Gold (3,450 / 5,000 pts)</span>
            <span className="text-amber-400">Next: Diamond Tier</span>
          </div>
          <div className="w-full bg-elevation-base h-2.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full w-[69%]" />
          </div>
        </div>
      </div>

      {/* Quests & Earning Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          How to Earn More Points
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Create Trader Account', pts: '+200 pts', desc: 'Instant bonus on sign up' },
            { title: 'Submit Challenge Review', pts: '+300 pts', desc: 'Share your 4-criteria feedback' },
            { title: 'Upload Payout Receipt', pts: '+500 pts', desc: 'Forensically verified payout proof' },
            { title: 'Refer Fellow Trader', pts: '+1,000 pts', desc: 'Via your unique affiliate link' },
          ].map((quest, i) => (
            <div key={i} className="p-5 rounded-2xl bg-elevation-surface border border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-400 font-mono">{quest.pts}</span>
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
              </div>
              <h3 className="text-sm font-bold text-white">{quest.title}</h3>
              <p className="text-xs text-slate-400">{quest.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Redeemable Rewards Catalog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewardsList.map((reward) => {
            const isClaimed = claimedRewards.includes(reward.id);
            const canAfford = points >= reward.points_cost;

            return (
              <div
                key={reward.id}
                className="bg-elevation-surface border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-5 transition-all hover:shadow-xl group"
              >
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {reward.points_cost.toLocaleString()} Points
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div>
                  {isClaimed ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center">
                      Voucher Claimed!
                    </div>
                  ) : (
                    <button
                      onClick={() => handleClaim(reward)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                          : 'bg-elevation-card text-slate-500 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      <span>{canAfford ? 'Redeem Voucher' : 'Need More Points'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
